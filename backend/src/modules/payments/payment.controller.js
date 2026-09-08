import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './payment.service.js';


const resolveActorId = (req) => {
  const fromAuth = req.user?.id;

  if (Number.isInteger(fromAuth) && fromAuth > 0) return fromAuth;

  const fromBody = req.validatedPayment?.createdById ?? req.body?.createdById;
  const parsed = Number(fromBody);
  
  if (Number.isInteger(parsed) && parsed > 0) return parsed;
  return undefined;
};

export const getAllPayments = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.validatedQuery ?? {};
  let { items, pagination } = await service.getAllPayment({ page, limit, status, search });

  if (items.length == 0){
    items = `No payment records or data found for the name ${search}`
  }

  res.status(200).json({ success: true, data: items, pagination });
});

export const getOnePayment = asyncHandler(async (req, res) => {
  const workId = req.validatedWorkId ?? Number(req.params.work_id);

  const payment = await service.getOnePayment(workId);

  res.status(200).json({ success: true, data: payment });
});

export const createPayment = asyncHandler(async (req, res) => {
  const workId = req.validatedWorkId ?? Number(req.params.work_id);
  const { amount, paymentMethod, receiptNumber } = req.validatedPayment ?? req.body;

  const payment = await service.createPayment(workId, {
    amount,
    paymentMethod,
    createdById: resolveActorId(req),
    receiptNumber,
  });

  res.status(201).json({ success: true, data: payment });
});
