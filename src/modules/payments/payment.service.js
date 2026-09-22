import * as repository from './payment.repository.js';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../enum/payments.js';
import { formatDateTime } from '../../utils/helpers.js';
import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const EPSILON = 0.005;

const notFound = (workId) => new AppError(`Work with ID ${workId} not found`, 404, MODULES.PAYMENT);

export const getOnePayment = async (id) => {

  const customer_payment = await repository.findById(id);
  if (!customer_payment) throw notFound(id);

  const history = customer_payment.payments ?? [];
  const latest = history[0] ?? null;
  const totalPaid = round2(history.reduce((total, p) => total + (p.paid ?? 0), 0));
  const latestStatus = latest?.paymentStatus;

  const remaining = latest ? (latest.remaining ?? null) : (customer_payment.finalAmount ?? null);

  return {
    Id: customer_payment.id,
    Acknowledgement: customer_payment.acknowledgementNumber,
    Name: `${customer_payment.customer?.name ?? ''} ${customer_payment.customer?.surname ?? ''}`.trim(),
    Reference: customer_payment.reference ?? null,
    Phone: customer_payment.customer?.phone ?? null,
    Discount_Amount: customer_payment.discountAmount,
    Final_Amount: customer_payment.finalAmount,
    Service: customer_payment.service?.name ?? null,
    Remaining: remaining,
    Total_Paid: totalPaid,
    Payment_status: latestStatus,
    Reminder: latestStatus !== PAYMENT_STATUS.COMPLETED,
    Payment_History: history.map((payment) => ({
      Id: payment.id,
      Payment_method: payment.paymentMethod,
      Payment_status: payment.paymentStatus,
      Paid: payment.paid,
      Remaining: payment.remaining ?? null,
      Receipt_Number: payment.receiptNumber ?? null,
      Created_At: formatDateTime(payment.createdAt),
    })),
  };
};

export const getAllPayment = async ({ page = 1, limit = 20, status, search } = {}) => {
  const { rows: works, total } = await repository.findWorks({ page, limit, status, search });

  const items = works.map((work) => {
    const paymentStatus = work.payments[0]?.paymentStatus ?? null;
    return {
      Id: work.id,
      Acknowledgement: work.acknowledgementNumber,
      Name: `${work.customer?.name ?? ''} ${work.customer?.surname ?? ''}`.trim(),
      Reference: work.reference ?? null,
      Service: work.service?.name ?? null,
      Payment_status: paymentStatus,
      Reminder: paymentStatus !== PAYMENT_STATUS.COMPLETED,
    };
  });

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    items,
    pagination: { page, limit, total, totalPages },
  };
};

const buildReceiptNumber = (workId) =>
  `REC-${new Date().getFullYear()}-${workId}-${Date.now().toString(36).toUpperCase()}${Math.floor(
    Math.random() * 1296,
  )
    .toString(36)
    .toUpperCase()
    .padStart(2, '0')}`;

export const createPayment = async (workId, amountOrInput, paymentMethod, ...rest) => {

  let amount;
  let method;
  let createdById;
  let receiptNumber;

  if (amountOrInput !== null && typeof amountOrInput === 'object') {
    ({ amount, paymentMethod: method, createdById, receiptNumber } = amountOrInput);
  } else {
    amount = amountOrInput;
    method = paymentMethod;
    const actorOpts = rest.length > 1 ? rest[rest.length - 1] : undefined;
    if (actorOpts !== null && typeof actorOpts === 'object') {
      ({ createdById, receiptNumber } = actorOpts);
    }
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Payment amount must be a positive number.', 400, MODULES.PAYMENT);
  }
  amount = round2(amount);

  if (typeof method !== 'string' || method.trim() === '') {
    throw new AppError('paymentMethod is required.', 400, MODULES.PAYMENT);
  }

  method = method.trim().toUpperCase();
  if (!Object.values(PAYMENT_METHOD).includes(method)) {
    throw new AppError(
      `Invalid paymentMethod "${method}". Allowed: ${Object.values(PAYMENT_METHOD).join(', ')}.`,
      400,
      MODULES.PAYMENT,
    );
  }

  if (createdById === undefined || createdById === null) {
    throw new AppError(
      'createdById (authenticated staff/admin id) is required to record a payment.',
      401,
      MODULES.PAYMENT,
    );
  }
  if (!Number.isInteger(createdById) || createdById <= 0) {
    throw new AppError('createdById must be a positive integer.', 400, MODULES.PAYMENT);
  }

  return repository.runInTransaction(async (tx) => {
    const work = await repository.findWorkWithPayments(workId, tx);
    if (!work) throw notFound(workId);

    const totalPaidBefore = round2(
      (work.payments ?? []).reduce((sum, p) => sum + (p.paid ?? 0), 0),
    );
    const remainingBefore = round2((work.finalAmount ?? 0) - totalPaidBefore);

    if (remainingBefore <= EPSILON) {
      throw new AppError(
        `Work ${workId} is already fully paid. No further payment is due.`,
        409,
        MODULES.PAYMENT,
      );
    }

    if (amount - remainingBefore > EPSILON) {
      throw new AppError(
        `Payment of ${amount} exceeds the remaining balance of ${remainingBefore} for work ${workId}.`,
        400,
        MODULES.PAYMENT,
      );
    }

    let remainingAfter = round2(remainingBefore - amount);
    if (remainingAfter < 0) remainingAfter = 0;

    const totalPaidAfter = round2(totalPaidBefore + amount);
    const paymentStatus =
      remainingAfter <= EPSILON
        ? PAYMENT_STATUS.COMPLETED
        : totalPaidAfter <= EPSILON
          ? PAYMENT_STATUS.PENDING
          : PAYMENT_STATUS.BALANCEDUE;

    const created = await repository.AddPayment(
      {
        workId,
        amount,
        paymentMethod: method,
        remaining: remainingAfter,
        paymentStatus,
        createdById,
        receiptNumber: receiptNumber ?? buildReceiptNumber(workId),
      },
      tx,
    );

    return {
      Id: created.id,
      Work_Id: created.workId,
      Paid: created.paid,
      Remaining: created.remaining,
      Payment_Method: created.paymentMethod,
      Payment_Status: created.paymentStatus,
      Receipt_Number: created.receiptNumber ?? null,
      Total_Paid: totalPaidAfter,
      Created_At: formatDateTime(created.createdAt),
    };
  });
};
