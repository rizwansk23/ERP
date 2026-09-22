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

const selectOneWork = {
  acknowledgementNumber: true,
  reference: true,
  createdAt: true,
  deadline: true,
  status: true,
  delivered: true,
  completed: true,
  processed: true,
  customer: { select: { name: true, surname: true } },
  service: { select: { name: true } },
};

export const findOneWork = async ({ work_id }) => {
  return Prisma.work.findFirst({
    where: {
      id: work_id,
      deletedAt: null,
    },
    select: selectOneWork,
  });
};

export const findWorkById = async ({ work_id }) => {
  return Prisma.work.findFirst({
    where: {
      id: work_id,
      deletedAt: null,
    },
    select: { id: true, customer: { select: { name: true, surname: true } } },
  });
};

export const updateWorkStatusById = async ({
  work_id,
  status,
  isCompleted,
  isDelivered,
  isProcessed,
  reference,
  customerName,
  deadline,
}) => {
  const data = {};
  if (status !== undefined) data.status = status;
  if (isDelivered !== undefined) data.delivered = isDelivered;
  if (isCompleted !== undefined) data.completed = isCompleted;
  if (isProcessed !== undefined) data.processed = isProcessed;
  if (reference !== undefined) data.reference = reference;
  if (customerName !== undefined) data.customer = { update: customerName };
  if (deadline !== undefined) data.deadline = deadline;

  return Prisma.work.update({
    where: {
      id: work_id,
    },
    data,
    select: selectOneWork,
  });
};

export const deleteWorkById = async ({ work_id }) => {
  return Prisma.work.update({
    where: {
      id: work_id,
    },
    data: {
      deletedAt: new Date(),
    },
    select: selectOneWork,
  });
};
