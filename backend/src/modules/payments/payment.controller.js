import { asyncHandler } from '../../utils/asyncHandler.js';
import ApiError from '../../utils/errors.js';
import {MODULES} from '../../enum/modules.js';
import * as service from './payment.service.js';

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await service.getAllPayment();

  if (!payments || payments.length === 0) {
    res.status(404).json({ success: false, message: 'No payments found' });
  }

  res.status(200).json({ success: true, data: payments });
});



export const getOnePayment = asyncHandler(async (req, res) => {
  const payment = await service.getOnePayment(req.params.id);

  if (!payment) {
    throw new ApiError(`Payment with ID ${re.params.id} not found`, 404, MODULES.PAYMENT);
  }

  res.status(200).json({ success: true, data: payment });

});

export const createPayment = asyncHandler(async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ success: true, data });
});
