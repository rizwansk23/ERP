// ============================================================================
// CUSTOMER INTAKE — REPOSITORY
// Pure Prisma queries. No business logic. No AppError throws here.
// If a query needs to fail loudly, it's the service layer's job.
// ============================================================================

import Prisma from '../../database/connection.js';

// ---------------------------------------------------------------------------
// CUSTOMER
// ---------------------------------------------------------------------------

/** Find a customer by exact (name, surname). Returns null if none. */
export const findCustomerByNameSurname = (name, surname) => {
  return Prisma.customer.findFirst({
    where: {
      name,
      surname,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      phone: true,
    },
  });
};

/** Find a customer by ID. Returns null if not found or deleted. */
export const findCustomerById = (id) => {
  return Prisma.customer.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      phone: true,
    },
  });
};

/** Create a new customer. */
export const createCustomer = (data) => {
  return Prisma.customer.create({
    data,
    select: {
      id: true,
      name: true,
      surname: true,
      phone: true,
    },
  });
};

/** Update a customer by ID. */
export const updateCustomer = (id, data) => {
  return Prisma.customer.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      surname: true,
      phone: true,
    },
  });
};

/**
 * Search customers by concatenated "name surname phone" containing `query`.
 * Returns up to `limit` matches. Used for the intake form suggestion dropdown.
 * Only returns name + phone as required by the frontend.
 */
export const searchCustomersByNameOrPhone = (query, limit = 5) => {
  return Prisma.customer.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: query } },
        { surname: { contains: query } },
        { phone: { contains: query } },
      ],
    },
    select: {
      name: true,
      phone: true,
    },
    take: limit,
    orderBy: { id: 'desc' },
  });
};

// ---------------------------------------------------------------------------
// SERVICE
// ---------------------------------------------------------------------------

/** Find a service by ID. Returns null if not found or deleted. */
export const findServiceById = (id) => {
  return Prisma.service.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      defaultCharge: true,
      isActive: true,
    },
  });
};

/** Find a service by exact (case-sensitive) name. */
export const findServiceByName = (name) => {
  return Prisma.service.findFirst({
    where: {
      name,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      defaultCharge: true,
      isActive: true,
    },
  });
};

/**
 * Create a new custom service.
 * isActive is set to false because custom services are not shown in the
 * default service list — they surface only via the intake form's
 * custom service dropdown.
 */
export const createCustomService = (name) => {
  return Prisma.service.create({
    data: {
      name,
      defaultCharge: 0,
      isActive: false,
    },
    select: {
      id: true,
      name: true,
      defaultCharge: true,
      isActive: true,
    },
  });
};

// ---------------------------------------------------------------------------
// WORK
// ---------------------------------------------------------------------------

/** Find a work by ID with related customer + service. Returns null if not found or deleted. */
export const findWorkById = (id) => {
  return Prisma.work.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          surname: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      payments: {
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      },
    },
  });
};

/** Create a new work row. */
export const createWork = (data) => {
  return Prisma.work.create({
    data,
  });
};

/** Update a work by ID. */
export const updateWork = (id, data) => {
  return Prisma.work.update({
    where: { id },
    data,
  });
};

/** Soft-delete a work. */
export const softDeleteWork = (id, deletedById) => {
  return Prisma.work.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedById,
    },
  });
};

/**
 * List intake records (Work rows joined with Customer + Service + Payments).
 * Filters:
 *   - search: matches name, surname, phone, acknowledgementNumber, reference
 *   - skips soft-deleted works
 * Supports pagination via skip/take.
 */
export const listIntakes = ({ skip, take, search }) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { acknowledgementNumber: { contains: search } },
            { reference: { contains: search } },
            { customer: { name: { contains: search } } },
            { customer: { surname: { contains: search } } },
            { customer: { phone: { contains: search } } },
          ],
        }
      : {}),
  };

  return Prisma.work.findMany({
    where,
    skip,
    take,
    orderBy: { id: 'desc' },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          surname: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      payments: {
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      },
    },
  });
};

/** Count total intake records matching the same filters as listIntakes. */
export const countIntakes = ({ search }) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { acknowledgementNumber: { contains: search } },
            { reference: { contains: search } },
            { customer: { name: { contains: search } } },
            { customer: { surname: { contains: search } } },
            { customer: { phone: { contains: search } } },
          ],
        }
      : {}),
  };

  return Prisma.work.count({ where });
};

/** Find the latest work (by id desc) to help generate the next ACK / receipt. */
export const findLatestWork = () => {
  return Prisma.work.findFirst({
    orderBy: { id: 'desc' },
    select: {
      id: true,
      acknowledgementNumber: true,
    },
  });
};

// ---------------------------------------------------------------------------
// PAYMENT
// ---------------------------------------------------------------------------

/**
 * Create an initial payment row.
 * Called only when `advance > 0` on CREATE, or when advance was 0 and
 * staff later sets advance > 0 on UPDATE.
 */
export const createPayment = (data) => {
  return Prisma.payment.create({
    data,
  });
};

/** Update a payment by ID. */
export const updatePayment = (id, data) => {
  return Prisma.payment.update({
    where: { id },
    data,
  });
};

/** Find the initial (first) payment for a work, if it exists. */
export const findInitialPaymentByWorkId = (workId) => {
  return Prisma.payment.findFirst({
    where: {
      workId,
      deletedAt: null,
    },
    orderBy: { id: 'asc' },
  });
};

/** Find the latest payment (by id desc) to help generate the next receipt. */
export const findLatestPayment = () => {
  return Prisma.payment.findFirst({
    orderBy: { id: 'desc' },
    select: {
      id: true,
      receiptNumber: true,
    },
  });
};

// ---------------------------------------------------------------------------
// ACK COUNTER
// ---------------------------------------------------------------------------

/** Get the AckCounter row for a given year. Returns null if none. */
export const findAckCounterByYear = (year) => {
  return Prisma.ackCounter.findUnique({
    where: { year },
  });
};

/** Create a new AckCounter row for a year (lastSeq starts at 0). */
export const createAckCounter = (year) => {
  return Prisma.ackCounter.create({
    data: { year, lastSeq: 0 },
  });
};

/** Atomically increment the AckCounter for a year. Returns the updated row. */
export const incrementAckCounter = (year) => {
  return Prisma.ackCounter.update({
    where: { year },
    data: { lastSeq: { increment: 1 } },
  });
};

// ---------------------------------------------------------------------------
// ACTIVITY LOG
// ---------------------------------------------------------------------------

/** Create an activity log entry. */
export const createActivityLogEntry = (data) => {
  return Prisma.activityLog.create({
    data,
  });
};

// ---------------------------------------------------------------------------
// TRANSACTION WRAPPER
// ---------------------------------------------------------------------------

/**
 * Run an array of Prisma operations inside a single transaction.
 * Use this in the service layer to keep multi-table writes atomic
 * (Customer + Work + Payment + ActivityLog).
 */
export const runTransaction = (operations) => {
  return Prisma.$transaction(operations);
};

/**
 * Interactive transaction — used when the logic inside needs to read+write
 * based on intermediate results (e.g. ACK counter peek → increment → use).
 */
export const withTransaction = (fn) => {
  return Prisma.$transaction(fn, {
    // SQLite serializes writes anyway; this is a safety guarantee for our
    // ACK counter and any other read-then-write inside the transaction.
    isolationLevel: 'Serializable',
  });
};