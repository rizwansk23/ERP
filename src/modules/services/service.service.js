import * as repository from './service.repository.js';
import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

const notFound = (id) => new AppError(`Service with ID ${id} not found`, 404, MODULES.SERVICES);

const toPublic = (service, { isStaff }) => {
  if (!service) return service;
  if (isStaff) {
    return {
      id: service.id,
      name: service.name,
      defaultCharge: service.defaultCharge,
    };
  }
  return {
    id: service.id,
    name: service.name,
    defaultCharge: service.defaultCharge,
    isActive: service.isActive,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

export const getAllServices = async (isStaff = false) => {
  // Staff only see active services; admins see everything (active + inactive).
  const services = await repository.findServices({ onlyActive: Boolean(isStaff) });
  return services.map((service) => toPublic(service, { isStaff: Boolean(isStaff) }));
};

export const getServiceById = async (id, isStaff = false) => {
  const service = await repository.findServiceById(id);
  if (!service) throw notFound(id);
  if (isStaff && !service.isActive) throw notFound(id);
  return toPublic(service, { isStaff: Boolean(isStaff) });
};

export const create = async (data) => {
  const existing = await repository.findServiceByName(data.name);
  if (existing) {
    throw new AppError(`Service with name "${data.name}" already exists`, 409, MODULES.SERVICES);
  }
  const service = await repository.createService(data);
  return toPublic(service, { isStaff: false });
};

export const update = async (id, data) => {
  const existing = await repository.findServiceById(id);
  if (!existing) throw notFound(id);

  if (data.name && data.name !== existing.name) {
    const duplicate = await repository.findServiceByName(data.name);
    if (duplicate && duplicate.id !== id) {
      throw new AppError(
        `Service with name "${data.name}" already exists`,
        409,
        MODULES.SERVICES
      );
    }
  }

  const updated = await repository.updateServiceById(id, data);
  return toPublic(updated, { isStaff: false });
};

export const changeStatus = async (id, isActive) => {
  const existing = await repository.findServiceById(id);
  if (!existing) throw notFound(id);
  const updated = await repository.updateServiceById(id, { isActive });
  return toPublic(updated, { isStaff: false });
};

export const remove = async (id, deletedById = null) => {
  const existing = await repository.findServiceById(id);
  if (!existing) throw notFound(id);
  await repository.softDeleteServiceById(id, deletedById);
  return { id };
};
