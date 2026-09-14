import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './work.service.js';

export const getAllWork = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.validatedQuery;

  const data = await service.getAllWork({page, limit, search});

  res.status(200).json({ success: true, message:data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ success: true, data });
});
