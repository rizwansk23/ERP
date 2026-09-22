import { asyncHandler } from '../../utils/asyncHandler.js';
import { MODULES } from '../../enum/modules.js';
import { addActivityLog } from '../activity-logs/activity.service.js';
import * as service from './service.service.js';

const isStaffUser = (req) => req.user?.role !== 'ADMIN';

export const getAllServices = asyncHandler(async (req, res) => {
  const data = await service.getAllServices(isStaffUser(req));
  res.status(200).json({ success: true, data });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const data = await service.getServiceById(req.serviceId, isStaffUser(req));
  res.status(200).json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await service.create(req.validatedService ?? req.body);

  await addActivityLog({
    userId: req.user?.id ?? null,
    action: 'Service created',
    entityType: MODULES.SERVICES,
    entityId: data.id,
    details: `Service "${data.name}" was created.`,
  }).catch(() => {});

  res.status(201).json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.update(req.serviceId, req.validatedService ?? req.body);

  await addActivityLog({
    userId: req.user?.id ?? null,
    action: 'Service updated',
    entityType: MODULES.SERVICES,
    entityId: req.serviceId,
    details: `Service ID ${req.serviceId} was updated.`,
  }).catch(() => {});

  res.status(200).json({ success: true, data });
});

export const changeStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.validatedServiceStatus ?? req.body;
  const data = await service.changeStatus(req.serviceId, isActive);

  await addActivityLog({
    userId: req.user?.id ?? null,
    action: isActive ? 'Service activated' : 'Service deactivated',
    entityType: MODULES.SERVICES,
    entityId: req.serviceId,
    details: `Service ID ${req.serviceId} was ${isActive ? 'activated' : 'deactivated'}.`,
  }).catch(() => {});

  res.status(200).json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  const data = await service.remove(req.serviceId, req.user?.id ?? null);

  await addActivityLog({
    userId: req.user?.id ?? null,
    action: 'Service deleted',
    entityType: MODULES.SERVICES,
    entityId: req.serviceId,
    details: `Service ID ${req.serviceId} was deleted.`,
  }).catch(() => {});

  res.status(200).json({ success: true, data });
});
