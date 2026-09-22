import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../enum/payments.js';

const fail = (message, details) => {
  const err = new AppError(message, 400, MODULES.PAYMENT);
  if (details) err.details = details;
  throw err;
};

const valideParamsIDs = (value, feild) => {
  if (value === undefined || value === null || value === '') return undefined;

  const id = Number(value);

  if (id <= 0) {
    fail(`Invalid ${feild} "${value}". It must be a positive integer.`);
  }
  if (!Number(value)) {
    fail(`Invalid ${feild} "${value}". Its must be integer.`);
  }
  return id;
};

const ALLOWED_METHODS = Object.values(PAYMENT_METHOD);
const ALLOWED_STATUSES = Object.values(PAYMENT_STATUS);
const MAX_AMOUNT = 1000000000; // yeh change hoga total work amount se "CHANGE"
const EPSILON = 0.005;


export const normalizePaymentMethod = (value) => {
  if (typeof value !== 'string') fail('paymentMethod is required and must be a string.');

  const method = value.trim().toUpperCase();
  if (!ALLOWED_METHODS.includes(method)) {
    fail(`Invalid paymentMethod "${value}". Allowed: ${ALLOWED_METHODS.join(', ')}.`);
  }
  return method;
};

export const normalizeAmount = (value) => {
  const amount = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;

  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    fail('amount is required and must be a finite number.');
  }

  if (amount <= 0) fail('amount must be greater than zero.');

  if (amount > MAX_AMOUNT) fail(`amount must not exceed ${MAX_AMOUNT}.`);

  if (Math.abs(Math.round(amount * 100) / 100 - amount) > EPSILON) {
    fail('amount must have at most 2 decimal places.');
  }

  return Math.round(amount * 100) / 100;
};

export const normalizeActorId = (value) => {
 return valideParamsIDs(value,"createdById")
};


export const validateWorkIdParam = (req, _res, next) => {
  req.validatedWorkId = valideParamsIDs(req.params.work_id,"work_id");
  next();
};


export const validateCreatePayment = (req, _res, next) => {
  if (!req.body || typeof req.body !== 'object') {
    fail('Request body is required: { amount, paymentMethod }.');
  }
  const { amount, paymentMethod, createdById, receiptNumber } = req.body;

  const sanitised = {
    amount: normalizeAmount(amount),
    paymentMethod: normalizePaymentMethod(paymentMethod),
  };

  const actorId = normalizeActorId(createdById);
  if (actorId !== undefined) sanitised.createdById = actorId;

  if (receiptNumber !== undefined) {
    if (typeof receiptNumber !== 'string' || receiptNumber.trim() === '') {
      fail('receiptNumber, when provided, must be a non-empty string.');
    }
    if (receiptNumber.trim().length > 64) fail('receiptNumber must be at most 64 characters.');
    sanitised.receiptNumber = receiptNumber.trim();
  }

  req.validatedPayment = sanitised;
  next();
};

export const validatePaymentListQuery = (req, _res, next) => {
  const query = req.query ?? {};
  let page = query.page === undefined ? 1 : Number(query.page);
  let limit = query.limit === undefined ? 20 : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) fail('page must be a positive integer.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    fail('limit must be an integer between 1 and 100.');
  }

  let status;
  if (query.status !== undefined && query.status !== '') {
    if (typeof query.status !== 'string') fail('status must be a string.');
    const upper = query.status.trim().toUpperCase();

    if (!ALLOWED_STATUSES.includes(upper)) {
      fail(`Invalid status "${query.status}". Allowed: ${ALLOWED_STATUSES.join(', ')}.`);
    }
    status = upper;
  }

  let search;
  if (query.search !== undefined && query.search !== '') {
    if (typeof query.search !== 'string') fail('search must be a string.');
    search = query.search.trim().slice(0, 100);
    if (search === '') search = undefined;
  }

  req.validatedQuery = { page, limit, status, search };
  next();
};
