import AppError from '../utils/errors.js';
import {MODULES} from '../enum/modules.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          'Authentication required',
          401,
          MODULES.AUTH
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Access denied',
          403,
          MODULES.AUTH
        )
      );
    }

    next();
  };
};