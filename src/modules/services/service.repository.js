import Prisma from '../../database/connection.js';

const serviceSelect = {
  id: true,
  name: true,
  defaultCharge: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

const notDeleted = { deletedAt: null };

export const findServices = async ({ onlyActive = false } = {}) => {
  return await Prisma.service.findMany({
    where: {
      ...notDeleted,
      ...(onlyActive ? { isActive: true } : {}),
    },
    orderBy: { id: 'asc' },
    select: serviceSelect,
  });
};

export const findServiceById = async (id) => {
  return await Prisma.service.findFirst({
    where: { id, ...notDeleted },
    select: serviceSelect,
  });
};

export const findServiceByName = async (name) => {
  return await Prisma.service.findFirst({
    where: { name, ...notDeleted },
    select: { id: true },
  });
};

export const createService = async (data) => {
  return await Prisma.service.create({
    data: {
      name: data.name,
      defaultCharge: data.defaultCharge,
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
    select: serviceSelect,
  });
};

export const updateServiceById = async (id, data) => {
  return await Prisma.service.update({
    where: { id },
    data,
    select: serviceSelect,
  });
};

export const softDeleteServiceById = async (id, deletedById = null) => {
  return await Prisma.service.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      ...(deletedById !== null && deletedById !== undefined ? { deletedById } : {}),
    },
    select: serviceSelect,
  });
};

// Backwards-compat exports (previous stub names).
export const findServicesLegacy = findServices;
export const create = createService;
