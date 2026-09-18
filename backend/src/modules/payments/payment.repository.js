import Prisma from '../../database/connection.js';

export const findById = async (id) => {
  return Prisma.work.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      charge: true,
      finalAmount: true,
      discountAmount: true,
      reference: true,
      acknowledgementNumber: true,
      customer: {
        select: { name: true, surname: true, phone: true },
      },
      service: {
        select: { name: true },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          paymentStatus: true,
          paid: true,
          paymentMethod: true,
          remaining: true,
          receiptNumber: true,
          createdAt: true,
        },
      },
    },
  });
};

export const findWorkWithPayments = async (workId, client = Prisma) => {
  return client.work.findFirst({
    where: { id: workId, deletedAt: null },
    select: {
      id: true,
      finalAmount: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, paid: true, remaining: true, paymentStatus: true },
      },
    },
  });
};

export const findWorks = async ({ page = 1, limit = 20, status, search } = {}) => {
  const skip = (page - 1) * limit;
  const where = { deletedAt: null };

  if (status) {
    where.payments = { some: { paymentStatus: { in: [status] } } };
  }

  if (search) {
    where.OR = [
      { acknowledgementNumber: { contains: search } },
      { reference: { contains: search } },
      { customer: { name: { contains: search } } },
      { customer: { surname: { contains: search } } },
    ];
  }

  const [total, rows] = await Promise.all([
    Prisma.work.count({ where }),
    Prisma.work.findMany({
      where,
      orderBy: { id: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        acknowledgementNumber: true,
        reference: true,
        customer: { select: { name: true, surname: true } },
        service: { select: { name: true } },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { paymentStatus: true },
        },
      },
    }),
  ]);

  return { rows, total };
};

export const AddPayment = async (
  { workId, amount, paymentMethod, remaining, paymentStatus, createdById, receiptNumber = null },
  client = Prisma,
) => {
  return client.payment.create({
    data: {
      workId,
      paid: amount,
      remaining,
      paymentMethod,
      paymentStatus,
      receiptNumber,
      createdById,
    },
  });
};

export const runInTransaction = async (fn) => Prisma.$transaction(fn);
