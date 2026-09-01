export const errorHandler = (err, req, res, next) => {
  const Statuscode = err.statusCode || 500;

  console.error({
    module: err.module || 'UNKNOWN',
    method: req.method,
    url: req.originalUrl,
    statusCode: Statuscode,
    message: err.message,
    stack: err.stack,
  });

  res.status(Statuscode).json({
    success: false,
    module: err.module || 'UNKNOWN',
    error: err.isOperational ? err.message : 'Server Error',
  });
};
