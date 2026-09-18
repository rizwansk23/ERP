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
  if (value === undefined || value === null || value === '') fail('work_id is required.');
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

const validateboolean = (value,name) => {
  if (value !== undefined && typeof value !== 'boolean') fail(` ${name} must be a boolean.`);
};

export const validateWorkUpdate = (req, _res, next) => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body))
    fail('Request body must be an object.');

  const { status, delivered, completed, processed, reference, customer_name, deadline } = req.body;

  let validStatus = status !== undefined ? normalizeWorkStatus(status) : undefined;

  validateboolean(delivered, "Delivered");
  validateboolean(completed, "Completed");
  validateboolean(processed, "Processed");

  let validReference = undefined;
  if (reference !== undefined) {
    if (typeof reference !== 'string') fail('reference must be a string.');

    validReference = reference.trim();
    if (validReference.length === 0) fail('reference must not be empty.');
    if (validReference.length > 100) fail('reference must be less than 100 characters long.');
  }

  let validDeadline = undefined;
  if (deadline !== undefined) {
    const parsed = deadline instanceof Date ? deadline : new Date(deadline);
    if (
      (typeof deadline !== 'string' && !(deadline instanceof Date)) ||
      Number.isNaN(parsed.getTime())
    )
      fail('deadline must be a valid date.');
    validDeadline = parsed;
  }

  let validCustomerName = undefined;
  if (customer_name !== undefined) {
    if (typeof customer_name !== 'string') fail('customer_name must be a string.');
    validCustomerName = customer_name.trim().replace(/\s+/g, ' ');
    if (validCustomerName.length === 0) fail('customer_name must not be empty.');
    if (validCustomerName.length > 100)
      fail('customer_name must be less than 100 characters long.');
  }

  if (
    [
      validStatus,
      delivered,
      completed,
      processed,
      validReference,
      validCustomerName,
      validDeadline,
    ].every((v) => v === undefined)
  )
    fail(
      'At least one field is required: status, delivered, completed, reference, customer_name, deadline.',
    );

  req.validateWorkStatus = {
    status: validStatus,
    isDelivered: delivered,
    isCompleted: completed,
    isProcessed: processed,
    reference: validReference,
    customer_name: validCustomerName,
    deadline: validDeadline,
  };

  next();
};
