import Prisma from '../../database/connection.js';

export const findById = async (id) => {
  return await Prisma.work.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      finalAmount: true,
      discountAmount: true,
      reference: true,
      acknowledgementNumber: true,
      customer: {
        select: {
          name: true,
          surname: true,
          phone: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          paymentStatus: true,
          paid: true,
          paymentMethod: true,
          remaining: true,
          createdAt: true,
        },
      },
    },
  });
};

export const findWorks = async () => {
  return Prisma.work.findMany({
    include: {
      customer: {
        select: {
          name: true,
          surname: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          paymentStatus: true,
        },
      },
    },
  });
};

export const AddPayment = async (workId, amount, paymentMethod, remaining, paymentStatus) => {
  return await Prisma.payment.create({
    data: {
      workId: workId,
      charge: 0,
      paid: amount,
      discountAmount: 0,
      finalAmount: 0,
      remaining: remaining,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      createdById: 1,     // add the staff/admin reference here
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
