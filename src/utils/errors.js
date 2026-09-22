export default class AppError extends Error {
  constructor(message, statusCode = 500, module = 'UNKNOWN') {
    super(message);
    this.statusCode = statusCode;
    this.module = module;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
