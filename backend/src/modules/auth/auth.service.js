import * as repository from './auth.repository.js';
import { generateToken } from '../../utils/generateToken.js';
import AppError from '../../utils/errors.js'
import {MODULES} from '../../enum/modules.js'


//it will used for auth error
const createAuthError = (message, statusCode) => {

  throw new AppError(message ,statusCode,MODULES.AUTH)
};

export const login = async ({ userId, password, deviceInfo }) => {
  const user = await repository.findUserByUserId(userId);

  if (!user) {
    throw createAuthError('Invalid user ID or password', 401);
  }

  if (!user.isActive || user.deletedAt) {
    throw createAuthError('User account is inactive', 403);
  }

  // Current project requirement
  if (user.passwordHash !== password) {
    throw createAuthError('Invalid user ID or password', 401);
  }

  const session = await repository.createLoginSession({
    userId: user.id,
    loginAt: new Date(),
    deviceInfo: deviceInfo || null,
    isActive: true,
  });

  const token = generateToken(user);

  return {
    token,
    session: {
      id: session.id,
      loginAt: session.loginAt,
      deviceInfo: session.deviceInfo,
      isActive: session.isActive,
    },
    user: {
      id: user.id,
      userId: user.userId,
      name: user.name,
      role: user.role,
    },
  };
};

export const logout = async (userId) => {
  const session = await repository.findActiveSession(userId);

  if (!session) {
    throw createAuthError('No active session found', 404);
  }

  await repository.logoutSession(session.id);

  return {
    message: 'Logout successful',
  };
};

export const getMe = async (userId) => {
  const user = await repository.findUserById(userId);

  if (!user) {
    throw createAuthError('User not found', 404);
  }

  return {
    id: user.id,
    userId: user.userId,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
  };
};

export const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await repository.findUserById(userId);

  if (!user) {
    throw createAuthError('User not found', 404);
  }

  if (user.passwordHash !== currentPassword) {
    throw createAuthError('Current password is incorrect', 400);
  }

  if (currentPassword === newPassword) {
    throw createAuthError(
      'New password must be different from current password',
      400
    );
  }

  await repository.updatePassword(userId, newPassword);

  return {
    message: 'Password changed successfully',
  };
};