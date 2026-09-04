import { asyncHandler } from '../../utils/asyncHandler.js';
import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

import {
  addStaff,
  getAllStaff,
  getStaffById,
  getStaffCredentials,
  editStaff,
  changeStaffStatus,
} from './staff.service.js';

const staffError = (message, statusCode = 400) => {
  return new AppError(message, statusCode, MODULES.STAFF);
};

const parseStaffId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw staffError('Invalid staff ID', 400);
  }

  return id;
};

// POST /api/staff
export const createStaff = asyncHandler(async (req, res) => {
  const { name, userId, password } = req.body;

  if (!name || !name.trim()) {
    throw staffError('Staff name is required', 400);
  }

  const staff = await addStaff({
    name,
    userId,
    password,
  });

  res.status(201).json({
    success: true,
    message: 'Staff created successfully',
    data: staff,
  });
});

// GET /api/staff
export const getStaff = asyncHandler(async (req, res) => {
  const staff = await getAllStaff();

  res.status(200).json({
    success: true,
    message: 'Staff fetched successfully',
    data: staff,
  });
});

// GET /api/staff/:id
export const getSingleStaff = asyncHandler(async (req, res) => {
  const id = parseStaffId(req.params.id);

  const staff = await getStaffById(id);

  res.status(200).json({
    success: true,
    message: 'Staff fetched successfully',
    data: staff,
  });
});

// GET /api/staff/:id/credentials
export const getStaffLoginCredentials = asyncHandler(async (req, res) => {
  const id = parseStaffId(req.params.id);

  const credentials = await getStaffCredentials(id);

  res.status(200).json({
    success: true,
    message: 'Staff credentials fetched successfully',
    data: credentials,
  });
});

// PATCH /api/staff/:id
export const updateStaff = asyncHandler(async (req, res) => {
  const id = parseStaffId(req.params.id);

  const { name, password } = req.body;

  if (name === undefined && password === undefined) {
    throw staffError(
      'At least one field is required: name or password',
      400
    );
  }

  const staff = await editStaff(id, {
    name,
    password,
  });

  res.status(200).json({
    success: true,
    message: 'Staff updated successfully',
    data: staff,
  });
});

// PATCH /api/staff/:id/status
export const updateStaffStatus = asyncHandler(async (req, res) => {
  const id = parseStaffId(req.params.id);

  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw staffError('isActive must be true or false', 400);
  }

  const staff = await changeStaffStatus(id, isActive);

  res.status(200).json({
    success: true,
    message: 'Staff status updated successfully',
    data: staff,
  });
});