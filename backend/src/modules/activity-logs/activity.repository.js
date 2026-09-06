import Prisma from '../../database/connection.js';


// Create a new activity log

export const createActivityLog = (data) => {
  return Prisma.activityLog.create({
    data,
    select: {
      id: true,
      userId: true,
      action: true,
      entityType: true,
      entityId: true,
      details: true,
      createdAt: true,
    },
  });
};


// Get all activity logs

export const findAllActivityLogs = ({
  search,
  action,
  staffOnly,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (action) {
    where.action = action;
  }

  if (staffOnly === true) {
    where.entityType = 'STAFF';
  }

  if (search) {
    where.OR = [
      {
        action: {
          contains: search,
        },
      },
      {
        details: {
          contains: search,
        },
      },
      {
        user: {
          name: {
            contains: search,
          },
        },
      },
    ];
  }

  return Prisma.$transaction([
    Prisma.activityLog.count({
      where,
    }),

    Prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            id: true,
            userId: true,
            name: true,
            role: true,
          },
        },
        action: true,
        entityType: true,
        entityId: true,
        details: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);
};


// .Get one activity log by ID

export const findActivityLogById = (id) => {
  return Prisma.activityLog.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          id: true,
          userId: true,
          name: true,
          role: true,
        },
      },
      action: true,
      entityType: true,
      entityId: true,
      details: true,
      createdAt: true,
    },
  });
};


//  Get activity logs of a particular user

export const findActivityLogsByUserId = (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  return Prisma.activityLog.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    skip,
    take: limit,
    select: {
      id: true,
      userId: true,
      action: true,
      entityType: true,
      entityId: true,
      details: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

//  * Soft delete an activity log
export const deleteActivityLog = (id, deletedById) => {
  return Prisma.activityLog.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      deletedById,
    },
    select: {
      id: true,
      deletedAt: true,
      deletedById: true,
    },
  });
};