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
          paid:true,
          paymentMethod:true,
          remaining: true,
          createdAt:true,
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

export const create = async (data) => {
  await Prisma.payment.create({
    data: {
      id: data.id,
      amount: data.amount,
      status: data.status,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
  });
};
