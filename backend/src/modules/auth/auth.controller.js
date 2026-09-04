import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './auth.service.js';
import AppError from '../../utils/errors.js'
import {MODULES} from '../../enum/modules.js'

export const login = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {

    throw new AppError('User ID and password are required',400,MODULES.AUTH)
  }

  const deviceInfo = req.headers['user-agent'] || null;

  const data = await service.login({
    userId,
    password,
    deviceInfo,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const data = await service.logout(req.user.id);

  res.status(200).json({
    success: true,
    ...data,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const data = await service.getMe(req.user.id);

  res.status(200).json({
    success: true,
    data,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new Error(
      'Current password and new password are required'
    );

    error.statusCode = 400;
    error.isOperational = true;
    error.module = 'AUTH';

    throw error;
  }

  const data = await service.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  res.status(200).json({
    success: true,
    ...data,
  });
});