import Prisma from '../../database/connection.js';

export const createStaff = (data) => {
  return Prisma.user.create({
    data,
    select: {
      id: true,
      userId: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const findAllStaff = () => {
  return Prisma.user.findMany({
    where: {
      role: 'STAFF',
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
};

export const findStaffById = (id) => {
  return Prisma.user.findFirst({
    where: {
      id,
      role: 'STAFF',
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findStaffCredentialsById = (id) => {
  return Prisma.user.findFirst({
    where: {
      id,
      role: 'STAFF',
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      passwordHash: true,
    },
  });
};

export const updateStaff = (id, data) => {
  return Prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      userId: true,
      name: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

 
};

 export const findStaffByUserId = (userId) => {
  return Prisma.user.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
    },
  });
};