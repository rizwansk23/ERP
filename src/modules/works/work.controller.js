import { MODULES } from '../../enum/modules.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { addActivityLog } from '../activity-logs/activity.service.js';
import * as service from './work.service.js';

export const getAllWorks = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.validatedQuery;

  const data = await service.getAllWorks({ page, limit, search });

  res.status(200).json({ success: true, message: data });
});

export const getOneWork = asyncHandler(async (req, res) => {
  const work_id = req.validateWorkId;

  const data = await service.getOneWork({ work_id });

  res.status(200).json({ message: 'success', data });
});

export const updateWorkStatus = asyncHandler(async (req, res) => {
  const work_id = req.validateWorkId;
  const { status, isDelivered, isCompleted, isProcessed, reference, customer_name, deadline } =
    req.validateWorkStatus;

  const data = await service.updateWorkStatus({
    work_id,
    status,
    isDelivered,
    isCompleted,
    isProcessed,
    reference,
    customer_name,
    deadline,
  });

  const message = [
    status && 'status',
    isDelivered && 'delivery',
    isCompleted && 'complete',
    isProcessed && 'process',
    reference && 'reference',
    customer_name && 'customer name',
    deadline && 'deadline',
  ].filter(Boolean);

  await addActivityLog({
    userId: req.user?.id ?? null,
    action: 'Work status updated',
    entityType: MODULES.WORKS,
    entityId: work_id,
    details: `Work ID ${work_id} was updated: ${message.join(', ')}.`,
  });

  res.status(200).json({ success: true, data });
});

export const deleteWork = asyncHandler(async (req, res) => {
  const work_id = req.validateWorkId;

  const data = await service.deleteWork({ work_id });

  await addActivityLog({
    userId: req.user?.id ?? null,
    action: 'Work deleted',
    entityType: MODULES.WORKS,
    entityId: work_id,
    details: `Work ID ${work_id} was deleted.`,
  });

  res.status(200).json({ success: true, data });
});
