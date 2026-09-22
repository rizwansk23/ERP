// ============================================================================
// CUSTOMER INTAKE — SERVICE
// All business logic for the intake flow.
// Throws AppError (MODULES.CUSTOMER) for any rule violation.
//
// Key behaviors:
//   - ACK numbers: atomic via AckCounter table (inside transaction)
//   - Receipt numbers: computed from latest saved + whole-transaction retry
//     on unique-constraint violation (because the DB unique constraint is
//     the authoritative protection against concurrent duplicates)
//   - Create = single transaction: Customer + Work + Payment + ActivityLog
//   - Update = updates existing Customer + Work + initial Payment in place
//   - Delete = soft-delete Work only
// ============================================================================

import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

import {
  findCustomerByNameSurname,
  searchCustomersByNameOrPhone,
  findWorkById,
  listIntakes,
  countIntakes,
  findInitialPaymentByWorkId,
  findLatestPayment,
  findAckCounterByYear,
  withTransaction,
} from './customer_intake.repository.js';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const MAX_TRANSACTION_RETRIES = 5; // bounded retries for receipt conflicts
const ACK_PREFIX = 'ACK';
const RECEIPT_PREFIX = 'RCPT';

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Throw AppError scoped to CUSTOMER module. */
const fail = (message, statusCode = 400) => {
  throw new AppError(message, statusCode, MODULES.CUSTOMER);
};

/** Current calendar year. */
const currentYear = () => new Date().getFullYear();

/** finalAmount = charge - discount (never negative). */
const computeFinalAmount = (charge, discount = 0) =>
  Math.max(charge - discount, 0);

/** remaining = final - paid (never negative). */
const computeRemaining = (charge, discount = 0, paid = 0) =>
  Math.max(charge - discount - paid, 0);

/** Derive payment status from paid vs final amount. */
const derivePaymentStatus = (finalAmount, paid) => {
  if (paid <= 0) return 'PENDING';
  if (paid >= finalAmount) return 'COMPLETED';
  return 'BALANCE';
};

/**
 * Turn deadline input (ISO date or preset token) into a real Date.
 * Presets:
 *   +10d → today + 10 days
 *   +30d → today + 30 days
 *   +2m  → today + 2 CALENDAR months (uses setMonth, not 60 days)
 *   custom → must be a real ISO date (Y-m-d); the "custom" token alone fails
 */
const resolveDeadline = (deadline) => {
  const t = String(deadline).trim();
  const d = new Date();

  if (t === '+10d') {
    d.setDate(d.getDate() + 10);
    return d;
  }
  if (t === '+30d') {
    d.setDate(d.getDate() + 30);
    return d;
  }
  if (t === '+2m') {
    d.setMonth(d.getMonth() + 2);
    return d;
  }
  if (t === 'custom') {
    fail('Deadline "custom" requires an actual date (YYYY-MM-DD)', 400);
  }
  return new Date(t);
};

/** True if err is a Prisma unique-constraint violation on the given field. */
const isUniqueConstraintError = (err, field) => {
  if (!err || err.code !== 'P2002') return false;
  const target = err.meta?.target;
  if (!target) return false;
  if (Array.isArray(target)) return target.includes(field);
  return target === field;
};

/**
 * Compute the next candidate receipt number from the LATEST COMMITTED Payment.
 * Called OUTSIDE the transaction so it sees only committed rows.
 * Format: RCPT-<year>-<seq>, seq resets each year.
 */
const generateNextReceiptNumber = async () => {
  const year = currentYear();
  const latest = await findLatestPayment();

  if (!latest || !latest.receiptNumber) {
    return `${RECEIPT_PREFIX}-${year}-1`;
  }

  const m = latest.receiptNumber.match(
    new RegExp(`^${RECEIPT_PREFIX}-(\\d{4})-(\\d+)$`),
  );
  if (!m) return `${RECEIPT_PREFIX}-${year}-1`;

  const lastYear = Number(m[1]);
  const lastSeq = Number(m[2]);

  if (lastYear !== year) return `${RECEIPT_PREFIX}-${year}-1`;
  return `${RECEIPT_PREFIX}-${year}-${lastSeq + 1}`;
};

/**
 * Atomically allocate the next ACK number for a year.
 * MUST be called inside a transaction.
 *
 * First-use race note:
 *   Two staff members may attempt to create the first intake of a new year
 *   simultaneously. `upsert` is atomic at the DB level — one request creates
 *   the row, the other's upsert sees it and becomes a no-op. The following
 *   `update` then increments safely.
 */
const nextAckNumberInTx = async (tx, year) => {
    await tx.ackCounter.upsert({
      where: { year },
      update: {},                          // no-op if the row already exists
      create: { year, lastSeq: 0 },
    });
  
    const updated = await tx.ackCounter.update({
      where: { year },
      data: { lastSeq: { increment: 1 } },
    });
  
    return `${ACK_PREFIX}-${year}-${updated.lastSeq}`;
  };

/**
 * Resolve a Service ID from either an explicit serviceId or a custom name.
 * Custom names are uppercased; if no matching service exists, a new one
 * is created with isActive: false and defaultCharge: 0.
 * MUST be called inside a transaction.
 */
const resolveServiceInTx = async (tx, { serviceId, customServiceName }) => {
  if (serviceId) {
    const svc = await tx.service.findFirst({
      where: { id: serviceId, deletedAt: null },
      select: { id: true },
    });
    if (!svc) fail('Service not found', 404);
    return svc.id;
  }

  const name = String(customServiceName).trim().toUpperCase();

  const existing = await tx.service.findFirst({
    where: { name, deletedAt: null },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await tx.service.create({
    data: { name, defaultCharge: 0, isActive: false },
    select: { id: true },
  });
  return created.id;
};

// ---------------------------------------------------------------------------
// PUBLIC SERVICE FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * PEEK next ACK number WITHOUT consuming it.
 * Frontend uses this to show the upcoming number on the intake form.
 */
export const peekAckNumber = async () => {
  const year = currentYear();
  const counter = await findAckCounterByYear(year);
  const nextSeq = counter ? counter.lastSeq + 1 : 1;
  return `${ACK_PREFIX}-${year}-${nextSeq}`;
};

/**
 * PEEK next receipt number WITHOUT consuming it.
 * Only a preview — the value returned by a successful save is authoritative.
 */
export const peekReceiptNumber = async () => {
  return generateNextReceiptNumber();
};

/** Suggestion dropdown — 3-field OR search, max 5, returns { name, phone }. */
export const suggestCustomers = async (query) => {
  const q = String(query || '').trim();
  if (!q) return [];
  return searchCustomersByNameOrPhone(q, 5);
};

/**
 * CREATE a new customer intake.
 *
 * Retries the ENTIRE transaction on P2002 receiptNumber conflicts, so that
 * the next attempt sees the newly committed receipt from another staff member.
 * Bounded by MAX_TRANSACTION_RETRIES.
 */
export const createIntake = async (payload, user) => {
  const {
    name,
    surname,
    phone,
    reference,
    serviceId,
    customServiceName,
    charge,
    discount = 0,
    advance = 0,
    paymentMode,
    deadline,
    remark,
    confirmExistingCustomer = false,
  } = payload;

  const year = currentYear();

  // -------- Pre-flight: existing-customer check --------
  const existingCustomer = await findCustomerByNameSurname(name, surname);

  if (existingCustomer && !confirmExistingCustomer) {
    const err = new AppError('Customer already exists', 409, MODULES.CUSTOMER);
    err.code = 'CUSTOMER_EXISTS';
    err.customer = existingCustomer; // { id, name, surname, phone }
    throw err;
  }

  // -------- Pre-flight: amounts + deadline --------
  const finalAmount = computeFinalAmount(charge, discount);
  const remaining = computeRemaining(charge, discount, advance);
  const paymentStatus = derivePaymentStatus(finalAmount, advance);
  const resolvedDeadline = resolveDeadline(deadline);

  // -------- Transaction with whole-transaction retry --------
  let attempts = 0;
  while (attempts < MAX_TRANSACTION_RETRIES) {
    try {
      const result = await withTransaction(async (tx) => {
        // 1. Customer — reuse existing if provided, else create
        const customer = existingCustomer
          ? existingCustomer
          : await tx.customer.create({
              data: { name, surname, phone },
              select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
              },
            });

        // 2. Service
        const resolvedServiceId = await resolveServiceInTx(tx, {
          serviceId,
          customServiceName,
        });

        // 3. ACK — atomic
        const acknowledgementNumber = await nextAckNumberInTx(tx, year);

        // 4. Work
        const work = await tx.work.create({
          data: {
            customerId: customer.id,
            serviceId: resolvedServiceId,
            acknowledgementNumber,
            reference: reference || null,
            workDate: new Date(),
            deadline: resolvedDeadline,
            remark: remark || null,
            charge,
            discountAmount: discount,
            finalAmount,
            status: advance >= finalAmount ? 'ACCEPTED' : 'PENDING',
            createdById: user.id,
          },
        });

        // 5. Payment — only if advance > 0
        let payment = null;
        if (advance > 0) {
          // Candidate receipt from LATEST COMMITTED row (outside this tx)
          const receiptNumber = await generateNextReceiptNumber();

          payment = await tx.payment.create({
            data: {
              workId: work.id,
              paid: advance,
              remaining,
              paymentMethod: paymentMode,
              paymentStatus,
              receiptNumber,
              createdById: user.id,
            },
          });
        }

        // 6. Activity log — one combined entry
        await tx.activityLog.create({
          data: {
            userId: user.id,
            action: 'CUSTOMER_INTAKE_CREATED',
            entityType: 'WORK',
            entityId: work.id,
            details: JSON.stringify({
              acknowledgementNumber,
              customerId: customer.id,
              serviceId: resolvedServiceId,
              charge,
              discount,
              finalAmount,
              advance,
              remaining,
              paymentMode: paymentMode || null,
              receiptNumber: payment?.receiptNumber || null,
            }),
          },
        });

        return {
          workId: work.id,
          customerId: customer.id,
          acknowledgementNumber,
          receiptNumber: payment?.receiptNumber || null,
          paymentId: payment?.id || null,
        };
      });

      return result; // success — stop retrying
    } catch (err) {
      if (isUniqueConstraintError(err, 'receipt_number')) {
        attempts++;
        continue; // retry the ENTIRE transaction
      }
      throw err; // any other error → bubble up
    }
  }

  fail('Failed to allocate a unique receipt number', 500);
};

/**
 * LIST intakes with pagination + search.
 */
export const getAllIntakes = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    listIntakes({ skip, take: limit, search }),
    countIntakes({ search }),
  ]);

  const items = rows.map((w) => {
    const initialPayment = (w.payments || [])[0] || null;
    return {
      id: w.id,
      acknowledgementNumber: w.acknowledgementNumber,
      reference: w.reference || null,
      name: w.customer.name,
      surname: w.customer.surname,
      phone: w.customer.phone,
      serviceName: w.service.name,
      workDate: w.workDate,
      deadline: w.deadline,
      charge: w.charge,
      discount: w.discountAmount,
      finalAmount: w.finalAmount,
      paid: initialPayment ? initialPayment.paid : 0,
      remaining: initialPayment ? initialPayment.remaining : w.finalAmount,
      paymentMethod: initialPayment ? initialPayment.paymentMethod : null,
      paymentStatus: initialPayment ? initialPayment.paymentStatus : 'PENDING',
      status: w.status,
      createdAt: w.createdAt,
    };
  });

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * GET one intake by Work ID.
 */
export const getIntakeById = async (id) => {
  const work = await findWorkById(id);
  if (!work) fail('Intake not found', 404);

  const initialPayment = (work.payments || [])[0] || null;

  return {
    id: work.id,
    acknowledgementNumber: work.acknowledgementNumber,
    reference: work.reference || null,
    name: work.customer.name,
    surname: work.customer.surname,
    phone: work.customer.phone,
    serviceId: work.service.id,
    serviceName: work.service.name,
    workDate: work.workDate,
    deadline: work.deadline,
    remark: work.remark || null,
    charge: work.charge,
    discount: work.discountAmount,
    finalAmount: work.finalAmount,
    paid: initialPayment ? initialPayment.paid : 0,
    remaining: initialPayment ? initialPayment.remaining : work.finalAmount,
    paymentMethod: initialPayment ? initialPayment.paymentMethod : null,
    paymentStatus: initialPayment ? initialPayment.paymentStatus : 'PENDING',
    receiptNumber: initialPayment ? initialPayment.receiptNumber : null,
    status: work.status,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
  };
};

/**
 * UPDATE an existing intake.
 *
 * Rules:
 *   - ACK is immutable.
 *   - Customer fields + Work fields are updated in place.
 *   - Payment row: if it exists → update in place.
 *                  if it doesn't and advance becomes > 0 → create it (inside
 *                  the same retry-the-whole-transaction loop).
 *   - Bounded retry on receiptNumber conflicts (whole-transaction retry).
 */
export const updateIntake = async (id, payload, user) => {
  const existingWork = await findWorkById(id);
  if (!existingWork) fail('Intake not found', 404);

  if (payload.acknowledgementNumber !== undefined) {
    fail('Acknowledgement number cannot be changed');
  }

  // Merge values
  const mergedName = payload.name ?? existingWork.customer.name;
  const mergedSurname = payload.surname ?? existingWork.customer.surname;
  const mergedPhone = payload.phone ?? existingWork.customer.phone;

  const mergedCharge = payload.charge ?? existingWork.charge;
  const mergedDiscount = payload.discount ?? existingWork.discountAmount;
  if (mergedDiscount > mergedCharge) {
    fail('Discounted price cannot exceed the payment charges');
  }

  const existingPayment = await findInitialPaymentByWorkId(id);
  const currentAdvance = existingPayment ? existingPayment.paid : 0;
  const mergedAdvance =
    payload.advance !== undefined ? payload.advance : currentAdvance;

  const mergedFinal = computeFinalAmount(mergedCharge, mergedDiscount);
  if (mergedAdvance > mergedFinal) {
    fail('Advance cannot exceed (charges - discount)');
  }
  const mergedRemaining = computeRemaining(
    mergedCharge,
    mergedDiscount,
    mergedAdvance,
  );
  const mergedPaymentStatus = derivePaymentStatus(
    mergedFinal,
    mergedAdvance,
  );

  const mergedReference =
    payload.reference !== undefined ? payload.reference : existingWork.reference;
  const mergedRemark =
    payload.remark !== undefined ? payload.remark : existingWork.remark;
  const mergedStatus = payload.status ?? existingWork.status;

  let mergedDeadline = existingWork.deadline;
  if (payload.deadline !== undefined) {
    mergedDeadline = resolveDeadline(payload.deadline);
  }

  let mergedPaymentMode = existingPayment
    ? existingPayment.paymentMethod
    : null;
  if (payload.paymentMode !== undefined && payload.paymentMode !== null) {
    mergedPaymentMode = payload.paymentMode;
  }



  // ---- Transaction with whole-transaction retry ----
  let attempts = 0;
  while (attempts < MAX_TRANSACTION_RETRIES) {
    try {
      await withTransaction(async (tx) => {
        // 0. Resolve service (existing OR create custom) INSIDE the same tx
            let resolvedServiceId = existingWork.service.id;
            if (
                payload.serviceId !== undefined ||
                (payload.customServiceName !== undefined &&
                payload.customServiceName !== null)
            ) {
                resolvedServiceId = await resolveServiceInTx(tx, {
                serviceId: payload.serviceId ?? null,
                customServiceName: payload.customServiceName ?? null,
                });
            }
        // 1. Customer
        await tx.customer.update({
          where: { id: existingWork.customer.id },
          data: {
            name: mergedName,
            surname: mergedSurname,
            phone: mergedPhone,
          },
        });

        // 2. Work
        await tx.work.update({
          where: { id },
          data: {
            serviceId: resolvedServiceId,
            reference: mergedReference || null,
            deadline: mergedDeadline,
            remark: mergedRemark || null,
            charge: mergedCharge,
            discountAmount: mergedDiscount,
            finalAmount: mergedFinal,
            status: mergedStatus,
          },
        });

        // 3. Payment
        if (existingPayment) {
          await tx.payment.update({
            where: { id: existingPayment.id },
            data: {
              paid: mergedAdvance,
              remaining: mergedRemaining,
              paymentMethod: mergedPaymentMode || existingPayment.paymentMethod,
              paymentStatus: mergedPaymentStatus,
            },
          });
        } else if (mergedAdvance > 0) {
          const receiptNumber = await generateNextReceiptNumber();
          await tx.payment.create({
            data: {
              workId: id,
              paid: mergedAdvance,
              remaining: mergedRemaining,
              paymentMethod: mergedPaymentMode || 'CASH',
              paymentStatus: mergedPaymentStatus,
              receiptNumber,
              createdById: user.id,
            },
          });
        }

        // 4. Activity log
        await tx.activityLog.create({
          data: {
            userId: user.id,
            action: 'CUSTOMER_INTAKE_UPDATED',
            entityType: 'WORK',
            entityId: id,
            details: JSON.stringify({
              acknowledgementNumber: existingWork.acknowledgementNumber,
              changes: {
                charge: mergedCharge,
                discount: mergedDiscount,
                advance: mergedAdvance,
                finalAmount: mergedFinal,
                remaining: mergedRemaining,
                status: mergedStatus,
              },
            }),
          },
        });
      });

      return { id };
    } catch (err) {
      if (isUniqueConstraintError(err, 'receipt_number')) {
        attempts++;
        continue;
      }
      throw err;
    }
  }

  fail('Failed to allocate a unique receipt number', 500);
};

/**
 * SOFT-DELETE an intake (Work only).
 */
export const deleteIntake = async (id, user) => {
  const work = await findWorkById(id);
  if (!work) fail('Intake not found', 404);

  await withTransaction(async (tx) => {
    await tx.work.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: user.id,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: 'CUSTOMER_INTAKE_DELETED',
        entityType: 'WORK',
        entityId: id,
        details: JSON.stringify({
          acknowledgementNumber: work.acknowledgementNumber,
        }),
      },
    });
  });

  return { id };
};