import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './work.service.js';

export const getAllWorks = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.validatedQuery;

  const data = await service.getAllWorks({ page, limit, search });

  res.status(200).json({ success: true, message: data });
});

export const getOneWork = asyncHandler(async (req, res) => {
  const { work_id } = req.validateWorkId;

  const data = await service.getOneWork({ work_id });

  res.status(200).json({ message: 'success', data });
});

export const updateWorkStatus = asyncHandler(async (req, res) => {
  const work_id = req.validateWorkId;
  const { status, isDelivered, isCompleted} = req.validateWorkStatus;

  const data = await service.updateWorkStatus({ work_id, status, isDelivered, isCompleted });

  console.log({ work_id, status, isDelivered, isCompleted })

  res.status(201).json({ success: true, data });
});
