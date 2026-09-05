import {
  createActivityLog,
  findAllActivityLogs,
  findActivityLogById,
  findActivityLogsByUserId,
  deleteActivityLog,
} from './activity.repository.js';

import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

const createActivityError = (message, statusCode = 500) => {
  return new AppError(message, statusCode, MODULES.ACTIVITY_LOG);
};

//  Create activity log 
export const addActivityLog = async ({
  userId,
  action,
  entityType,
  entityId,
  details,
}) => {
  if (!userId) {
    throw createActivityError('User ID is required', 400);
  }

  if (!action || !action.trim()) {
    throw createActivityError('Activity action is required', 400);
  }

  if (!entityType || !entityType.trim()) {
    throw createActivityError('Entity type is required', 400);
  }

  return createActivityLog({
    userId,
    action: action.trim(),
    entityType: entityType.trim(),
    entityId: entityId ?? null,
    details: details?.trim() || null,
  });
};


//  Get all activity logs

export const getAllActivityLogs = async ({
  search,
  action,
  staffOnly,
  page = 1,
  limit = 10,
}) => {
  const currentPage = Number(page);
  const currentLimit = Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
  ) {
    throw createActivityError('Page must be a positive integer', 400);
  }

  if (
    !Number.isInteger(currentLimit) ||
    currentLimit < 1 ||
    currentLimit > 100
  ) {
    throw createActivityError(
      'Limit must be between 1 and 100',
      400
    );
  }

  const normalizedSearch = search?.trim() || undefined;
  const normalizedAction = action?.trim() || undefined;

  const [total, logs] = await findAllActivityLogs({
    search: normalizedSearch,
    action: normalizedAction,
    staffOnly: staffOnly === true || staffOnly === 'true',
    page: currentPage,
    limit: currentLimit,
  });

  return {
    logs,
    pagination: {
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};

// Get one activity log
export const getActivityLogById = async (id) => {
  const activityId = Number(id);

  if (!Number.isInteger(activityId) || activityId < 1) {
    throw createActivityError('Invalid activity log ID', 400);
  }

  const activityLog = await findActivityLogById(activityId);

  if (!activityLog) {
    throw createActivityError('Activity log not found', 404);
  }

  return activityLog;
};

//  * Get activity logs of a particular user
export const getActivityLogsByUserId = async (
  userId,
  page = 1,
  limit = 10
) => {
  const activityUserId = Number(userId);

  if (
    !Number.isInteger(activityUserId) ||
    activityUserId < 1
  ) {
    throw createActivityError('Invalid user ID', 400);
  }

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
  ) {
    throw createActivityError('Page must be a positive integer', 400);
  }

  if (
    !Number.isInteger(currentLimit) ||
    currentLimit < 1 ||
    currentLimit > 100
  ) {
    throw createActivityError(
      'Limit must be between 1 and 100',
      400
    );
  }

  return findActivityLogsByUserId(
    activityUserId,
    currentPage,
    currentLimit
  );
};

// ] * Soft delete activity log/
export const removeActivityLog = async (id, deletedById) => {
  const activityId = Number(id);

  if (!Number.isInteger(activityId) || activityId < 1) {
    throw createActivityError('Invalid activity log ID', 400);
  }

  const activityLog = await findActivityLogById(activityId);

  if (!activityLog) {
    throw createActivityError('Activity log not found', 404);
  }

  return deleteActivityLog(activityId, deletedById);
};