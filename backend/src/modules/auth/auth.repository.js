import Prisma from '../../database/connection.js';

export const findUserByUserId = async (userId) => {
  return await Prisma.user.findUnique({
    where: {
      userId,
    },
  });
};

export const findUserById = async (id) => {
  return await Prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const createLoginSession = async (data) => {
  return await Prisma.loginSession.create({
    data,
  });
};

export const findActiveSession = async (userId) => {
  return await Prisma.loginSession.findFirst({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      loginAt: 'desc',
    },
  });
};

export const logoutSession = async (sessionId) => {
  return await Prisma.loginSession.update({
    where: {
      id: sessionId,
    },
    data: {
      logoutAt: new Date(),
      isActive: false,
    },
  });
};

export const updatePassword = async (userId, newPassword) => {
  return await Prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash: newPassword,
    },
  });
};