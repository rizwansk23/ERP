import { asyncHandler } from '../../utils/asyncHandler.js';

import {
  getAllActivityLogs,
  getActivityLogById,
  getActivityLogsByUserId,
  removeActivityLog,
} from './activity.service.js';

  // Get all activity logs
export const getActivityLogs = asyncHandler(async (req, res) => {
  const {
    search,
    action,
    staffOnly,
    page = 1,
    limit = 10,
  } = req.query;

  const result = await getAllActivityLogs({
    search,
    action,
    staffOnly,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    message: 'Activity logs fetched successfully',
    data: result.logs,
    pagination: result.pagination,
  });
});

// Get single activity log
export const getSingleActivityLog = asyncHandler(async (req, res) => {
  const activityLog = await getActivityLogById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Activity log fetched successfully',
    data: activityLog,
  });
});

// Get activity logs by user ID
export const getUserActivityLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
  } = req.query;

  const logs = await getActivityLogsByUserId(
    req.params.userId,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    message: 'User activity logs fetched successfully',
    data: logs,
  });
});

// Soft delete activity log
export const deleteActivityLog = asyncHandler(async (req, res) => {
  const activityLog = await removeActivityLog(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Activity log deleted successfully',
    data: activityLog,
  });
});