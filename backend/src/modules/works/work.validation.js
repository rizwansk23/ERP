import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';
import { ALLOWED_WORK_STATUSES } from '../../enum/Work.js';

const fail = (message, details) => {
  const err = new AppError(message, 400, MODULES.WORKS);
  if (details) err.details = details;
  throw err;
};

const normalizeWorkStatus = (value) => {
  if (typeof value !== 'string') fail('status must be a string.');

  const upper = value.trim().toUpperCase();

  const allowedValues = Object.values(ALLOWED_WORK_STATUSES);

  if (!allowedValues.includes(upper)) {
    fail(`Invalid status "${value}". Allowed: ${allowedValues.join(', ')}.`);
  }
  return upper;
};

const validateParamsId = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (!Number(value)) fail(`Invalid work id  "${value}". Its must be integer.`);

  const id = Number(value);
  if (id <= 0) fail(`Invalid work id "${value}". It must be a positive integer.`);

  return id;
};

export const validateWorkListQuery = (req, _res, next) => {
  const query = req.query ?? {};
  let page = query.page === undefined ? 1 : Number(query.page);
  let limit = query.limit === undefined ? 20 : Number(query.limit);
  let search = query.search === undefined ? undefined : query.search.trim();

  if (!Number.isInteger(page) || page < 1) fail('page must be a positive integer.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    fail('limit must be an integer between 1 and 100.');

  if (search !== undefined) {
    if (typeof search != 'string') fail('search query must be a string.');
    if (search.length < 3) fail('search query must be at least 3 characters long.');
    if (search.length > 30) fail('search query must be less than 30 characters long.');
    if (!/^[a-zA-Z]+$/.test(search)) fail('search query must contain only letter & number.');

    if (search.includes(ALLOWED_WORK_STATUSES)) {
      search = search.toUpperCase();
    }
  }

  req.validatedQuery = { page, limit, search };
  next();
};

export const validateWorkId = (req, _res, next) => {
  req.validateWorkId = validateParamsId(req.params.work_id);
  next();
};

export const validateWorkUpdate = (req, _res, next) => {
  const requestBody = req.body ?? {};
  if (typeof requestBody !== 'object' || Array.isArray(requestBody)) {
    fail('Request body must be an object.');
  }

  let { status, delivered, completed, adminPassword } = requestBody;

  if (status !== undefined) status = normalizeWorkStatus(status);

  if (delivered !== undefined && typeof delivered !== 'boolean') {
    fail('delivered must be a boolean.');
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    fail('completed must be a boolean.');
  }

  if (adminPassword !== undefined) {
    if (typeof adminPassword !== 'string' || adminPassword.trim() === '') {
      fail('adminPassword, when provided, must be a non-empty string.');
    }
    adminPassword = adminPassword.trim();
  }

  if (status === undefined && delivered === undefined && completed === undefined) {
    fail('At least one field is required: status, delivered, completed.');
  }

  req.validateWorkStatus = { status, isDelivered: delivered, isCompleted: completed, adminPassword };

  next();
};
