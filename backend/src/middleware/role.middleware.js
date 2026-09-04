export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Authentication required');

      error.statusCode = 401;
      error.isOperational = true;
      error.module = 'AUTH';

      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('Access denied');

      error.statusCode = 403;
      error.isOperational = true;
      error.module = 'AUTH';

      return next(error);
    }

    next();
  };
};
