import Prisma from '../../database/connection.js';

export const findAllWorks = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const where = { deletedAt: null };

  if (search) {
    where.OR = [
      { acknowledgementNumber: { contains: search } },
      { status: { contains: search } },
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
        status: true,
        service: { select: { name: true } },
        customer: { select: { name: true, surname: true } },
      },
    }),
  ]);

  return { total, rows };
};

export const findOneWork = async ({ work_id }) => {
  return Prisma.work.findFirst({
    where: {
      id: work_id,
    },
    select: {
      acknowledgementNumber: true,
      reference: true,
      createdAt: true,
      deadline: true,
      status: true,
      delivered: true,
      completed: true,
      customer: { select: { name: true, surname: true } },
      service: { select: { name: true } },
    },
  });
};

export const updateWorkStatusById = async ({ work_id, status, isCompleted, isDelivered }) => {
  return Prisma.work.update({
    where: {
      id: work_id,
    },
    data: {
      status: status,
      delivered: isDelivered,
      completed: isCompleted,
    },
  });
};
