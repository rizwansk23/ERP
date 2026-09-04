import { asyncHandler } from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import MODULES from '../../enum/modules.js';
import * as service from './payment.service.js';

export const getOne = asyncHandler(async (req, res) => {
  const payment_id = await service.getOne(req.params.id);
  res.status(200).json({ success: true, payment_id });

  if (!payment_id) {
    throw new ApiError(`Payment with ID ${req} not found`, 404, MODULES.PAYMENT);
  }



});

export const create = asyncHandler(async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ success: true, data });
});
