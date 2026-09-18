import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './service.service.js';

export const getAllServices = asyncHandler(async (req, res) => {

    const isStaff = req.user.role !== 'admin';
  const data = await service.getAllServices(isStaff);
  res.status(200).json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ success: true, data });
});
