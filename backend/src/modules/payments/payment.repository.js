import Prisma from '../../database/connection.js';

export const findById = async (id) => {
  return await Prisma.payment.findUnique({
    where: { id: id },
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
