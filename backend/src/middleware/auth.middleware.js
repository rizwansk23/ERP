import jwt from 'jsonwebtoken';

import Prisma from '../database/connection.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createAuthError = (message, statusCode) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.isOperational = true;
  error.module = 'AUTH';

  return error;
};

export const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createAuthError('Authentication token is required', 401);
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    throw createAuthError('Authentication token is required', 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createAuthError('Invalid or expired authentication token', 401);
  }

  const user = await Prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw createAuthError('User not found', 401);
  }

  if (!user.isActive || user.deletedAt) {
    throw createAuthError('User account is inactive', 403);
  }

  req.user = user;

  next();
});