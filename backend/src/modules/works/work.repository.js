import Prisma from '../../database/connection.js';

export const findAllWork = async ({ page, limit, search }) => {
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
        id:true,
        acknowledgementNumber: true,
        status: true,
        service: { select: { name: true } },
        customer: { select: { name: true, surname: true } },
      },
    }),
  ]);

  return { total, rows };
};

export const create = async (data) => {
  // DB Logic here
  return { id: 'new-id', ...data };
};
