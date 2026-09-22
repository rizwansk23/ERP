import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

const fail = (message, details) => {
  const err = new AppError(message, 400, MODULES.SERVICES);
  if (details) err.details = details;
  throw err;
};

export const validateServiceId = (req, _res, next) => {
  const { id } = req.params;
  if (id === undefined || id === null || id === '') fail('Service id is required.');
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0)
    fail(`Invalid service id "${id}". It must be a positive integer.`);
  req.serviceId = parsed;
  next();
};

const validateName = (value, { required }) => {
  if (value === undefined) {
    if (required) fail('Service name is required.');
    return undefined;
  }
  if (typeof value !== 'string') fail('Service name must be a string.');
  const name = value.trim().replace(/\s+/g, ' ');
  if (name.length === 0) fail('Service name must not be empty.');
  if (name.length < 3) fail('Service name must be at least 3 characters long.');
  if (name.length > 100) fail('Service name must be less than 100 characters long.');
  return name;
};

const validateCharge = (value, { required }) => {
  if (value === undefined) {
    if (required) fail('defaultCharge is required.');
    return undefined;
  }
  const charge = Number(value);
  if (!Number.isFinite(charge)) fail('defaultCharge must be a number.');
  if (charge < 0) fail('defaultCharge must be a non-negative number.');
  if (charge > 10000000) fail('defaultCharge is unreasonably large.');
  return charge;
};

const validateIsActive = (value) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') fail('isActive must be a boolean.');
  return value;
};

export const validateCreateService = (req, _res, next) => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body))
    fail('Request body must be an object.');

  // Accept both camelCase (canonical) and legacy keys.
  
  const { name, defaultCharge, charge, isActive, Isactive } = req.body;

  const validName = validateName(name, { required: true });
  const rawCharge = defaultCharge !== undefined ? defaultCharge : charge;
  const validCharge = validateCharge(rawCharge, { required: true });
  const rawActive = isActive !== undefined ? isActive : Isactive;
  const validActive = validateIsActive(rawActive);

  req.validatedService = {
    name: validName,
    defaultCharge: validCharge,
    ...(validActive !== undefined ? { isActive: validActive } : {}),
  };
  next();
};

export const validateUpdateService = (req, _res, next) => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body))
    fail('Request body must be an object.');

  const { name, defaultCharge, charge, isActive, Isactive } = req.body;

  const validName = validateName(name, { required: false });
  const rawCharge = defaultCharge !== undefined ? defaultCharge : charge;
  const validCharge =
    rawCharge !== undefined ? validateCharge(rawCharge, { required: false }) : undefined;
  const rawActive = isActive !== undefined ? isActive : Isactive;
  const validActive = validateIsActive(rawActive);

  if (
    validName === undefined &&
    validCharge === undefined &&
    validActive === undefined
  )
    fail('At least one field is required: name, defaultCharge, isActive.');

  req.validatedService = {
    ...(validName !== undefined ? { name: validName } : {}),
    ...(validCharge !== undefined ? { defaultCharge: validCharge } : {}),
    ...(validActive !== undefined ? { isActive: validActive } : {}),
  };
  next();
};

export const validateServiceStatus = (req, _res, next) => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body))
    fail('Request body must be an object.');

  const { isActive, Isactive } = req.body;
  const raw = isActive !== undefined ? isActive : Isactive;
  if (raw === undefined) fail('isActive is required (boolean).');
  req.validatedServiceStatus = { isActive: validateIsActive(raw) };
  next();
};

// Backwards-compat alias (old stub name).
export const validateCreate = validateCreateService;
