import Prisma from '../../database/connection.js';

export const getDashboardSummary = async (startDate, endDate) => {
  const dateFilter = {
    gte: startDate,
    lte: endDate,
  };

  const [totalWorksDone, revenueResult, pendingResult] =
    await Prisma.$transaction([
      Prisma.work.count({
        where: {
          completed: true,
          deletedAt: null,
          workDate: dateFilter,
        },
      }),

      Prisma.payment.aggregate({
        _sum: {
          paid: true,
        },
        where: {
          deletedAt: null,
          createdAt: dateFilter,
        },
      }),

      Prisma.payment.aggregate({
        _sum: {
          remaining: true,
        },
        where: {
          deletedAt: null,
          remaining: {
            gt: 0,
          },
          createdAt: dateFilter,
        },
      }),
    ]);

  return {
    totalWorksDone,
    totalRevenueEarned: revenueResult._sum.paid || 0,
    pendingPayments: pendingResult._sum.remaining || 0,
  };
};

export const getWorksByService = async (startDate, endDate) => {
  const services = await Prisma.service.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          works: {
            where: {
              deletedAt: null,
              workDate: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return services.map((service) => ({
    serviceId: service.id,
    serviceName: service.name,
    totalWorks: service._count.works,
  }));
};