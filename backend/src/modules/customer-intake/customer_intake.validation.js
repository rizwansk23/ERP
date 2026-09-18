// ============================================================================
// CUSTOMER INTAKE — VALIDATION
// Central validation for create, update, and query payloads.
// All failures throw AppError with MODULES.CUSTOMER.
//
// IMPORTANT: These functions MUTATE the incoming body in place.
// After validation, the caller can safely pass `body` to the service layer
// and expect normalized values (trimmed, uppercased where applicable).
// ============================================================================

import AppError from '../../utils/errors.js';
import { MODULES } from '../../enum/modules.js';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const MAX_NAME = 50;
const MAX_SURNAME = 50;
const MAX_REFERENCE = 50;
const MAX_REMARK = 500;
const MAX_CUSTOM_SERVICE_NAME = 100;

const ALLOWED_PAYMENT_MODES = ['CASH', 'ONLINE', 'CHEQUE', 'LOAN'];
const ALLOWED_PAYMENT_STATUSES = ['PENDING', 'BALANCE', 'COMPLETED'];
const ALLOWED_WORK_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED'];
const ALLOWED_DEADLINE_PRESETS = ['+10d', '+30d', '+2m', 'custom'];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Throw AppError scoped to the CUSTOMER module. */
const fail = (message, statusCode = 400) => {
  throw new AppError(message, statusCode, MODULES.CUSTOMER);
};

/** True if `v` is a non-empty string after trimming. */
const isNonEmptyString = (v) =>
  typeof v === 'string' && v.trim().length > 0;

/** True if `v` is a finite number >= 0. */
const isNonNegativeNumber = (v) =>
  typeof v === 'number' && !Number.isNaN(v) && v >= 0;

/** True if `v` is a 10-digit numeric string. */
const isValidPhone = (v) =>
  typeof v === 'string' && /^[0-9]{10}$/.test(v.trim());

/**
 * True if `v` is a REAL calendar date in strict YYYY-MM-DD format.
 * Rejects dates like 2026-02-30 or 2026-13-01.
 */
const isValidISODate = (v) => {
  if (typeof v !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;

  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
};

/** Uppercase a payment mode value; trims first. */
const normalizePaymentMode = (v) =>
  typeof v === 'string' ? v.trim().toUpperCase() : v;

/** Check `deadline` is either a valid ISO date or an allowed preset. */
const isValidDeadline = (v) => {
  if (!isNonEmptyString(v)) return false;
  const t = v.trim();
  return (
    ALLOWED_DEADLINE_PRESETS.includes(t) || isValidISODate(t)
  );
};

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

/**
 * Validate + normalize the payload for creating a new customer intake.
 * Mutates `body` in place with trimmed/uppercased values.
 *
 * Expected body:
 *   {
 *     name, surname, phone, reference?,
 *     serviceId?  |  customServiceName?,
 *     charge, discount?, advance?, paymentMode?,
 *     deadline, remark?, confirmExistingCustomer?
 *   }
 */
export const validateCreateIntake = (body) => {
  if (!body || typeof body !== 'object') {
    fail('Request body is required');
  }

  // ---------- Customer ----------
  if (!isNonEmptyString(body.name)) fail('Name is required');
  if (body.name.trim().length > MAX_NAME)
    fail(`Name cannot exceed ${MAX_NAME} characters`);
  body.name = body.name.trim();

  if (!isNonEmptyString(body.surname)) fail('Surname is required');
  if (body.surname.trim().length > MAX_SURNAME)
    fail(`Surname cannot exceed ${MAX_SURNAME} characters`);
  body.surname = body.surname.trim();

  if (!isValidPhone(body.phone))
    fail('Mobile number must be exactly 10 digits');
  body.phone = body.phone.trim();

  // ---------- Reference (optional) ----------
  if (
    body.reference !== undefined &&
    body.reference !== null &&
    body.reference !== ''
  ) {
    if (typeof body.reference !== 'string')
      fail('Reference must be a string');
    if (body.reference.trim().length > MAX_REFERENCE)
      fail(`Reference cannot exceed ${MAX_REFERENCE} characters`);
    body.reference = body.reference.trim();
  } else {
    body.reference = null;
  }

  // ---------- Service ----------
  const hasServiceId =
    body.serviceId !== undefined && body.serviceId !== null;
  const hasCustomName = isNonEmptyString(body.customServiceName);

  if (!hasServiceId && !hasCustomName)
    fail('Service is required (serviceId or customServiceName)');

  if (hasServiceId) {
    const sid = Number(body.serviceId);
    if (!Number.isInteger(sid) || sid <= 0)
      fail('serviceId must be a positive integer');
    body.serviceId = sid;
    // If serviceId provided, drop customServiceName to avoid ambiguity
    body.customServiceName = null;
  }

  if (hasCustomName) {
    if (body.customServiceName.trim().length > MAX_CUSTOM_SERVICE_NAME) {
      fail(
        `Custom service name cannot exceed ${MAX_CUSTOM_SERVICE_NAME} characters`,
      );
    }
    // Uppercase custom service names
    body.customServiceName = body.customServiceName
      .trim()
      .toUpperCase();
    body.serviceId = null;
  }

  // ---------- Charge ----------
  if (!isNonNegativeNumber(body.charge))
    fail('Payment charges must be a number >= 0');

  // ---------- Discount ----------
  const discount = body.discount === undefined ? 0 : body.discount;
  if (!isNonNegativeNumber(discount))
    fail('Discounted price must be a number >= 0');
  if (discount > body.charge)
    fail('Discounted price cannot exceed the payment charges');
  body.discount = discount;

  // ---------- Advance ----------
  const advance = body.advance === undefined ? 0 : body.advance;
  if (!isNonNegativeNumber(advance))
    fail('Payment received / advance must be a number >= 0');

  const netAmount = body.charge - discount;
  if (advance > netAmount)
    fail('Advance cannot exceed (charges - discount)');
  body.advance = advance;

  // ---------- Payment mode ----------
  if (advance > 0) {
    if (!isNonEmptyString(body.paymentMode))
      fail('Payment mode is required when advance > 0');

    body.paymentMode = normalizePaymentMode(body.paymentMode);
    if (!ALLOWED_PAYMENT_MODES.includes(body.paymentMode))
      fail(
        `Payment mode must be one of: ${ALLOWED_PAYMENT_MODES.join(', ')}`,
      );
  } else if (
    body.paymentMode !== undefined &&
    body.paymentMode !== null &&
    body.paymentMode !== ''
  ) {
    body.paymentMode = normalizePaymentMode(body.paymentMode);
    if (!ALLOWED_PAYMENT_MODES.includes(body.paymentMode))
      fail(
        `Payment mode must be one of: ${ALLOWED_PAYMENT_MODES.join(', ')}`,
      );
  } else {
    // advance = 0 and no mode provided
    body.paymentMode = null;
  }

  // ---------- Deadline ----------
  if (!isNonEmptyString(body.deadline))
    fail('Deadline is required');
  if (!isValidDeadline(body.deadline))
    fail(
      'Deadline must be a valid date (YYYY-MM-DD) or a preset (+10d, +30d, +2m, custom)',
    );
  body.deadline = body.deadline.trim();

  // ---------- Remark (optional) ----------
  if (
    body.remark !== undefined &&
    body.remark !== null &&
    body.remark !== ''
  ) {
    if (typeof body.remark !== 'string')
      fail('Remark must be a string');
    if (body.remark.trim().length > MAX_REMARK)
      fail(`Remark cannot exceed ${MAX_REMARK} characters`);
    body.remark = body.remark.trim();
  } else {
    body.remark = null;
  }

  // ---------- Confirm flag ----------
  if (
    body.confirmExistingCustomer !== undefined &&
    typeof body.confirmExistingCustomer !== 'boolean'
  ) {
    fail('confirmExistingCustomer must be true or false');
  }
};

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------

/**
 * Validate + normalize the payload for updating an existing intake.
 * Mutates `body` in place.
 *
 * All fields are optional; at least one is required.
 * Updates affect the existing Customer / Work / initial Payment rows only.
 * No new rows are created here.
 */
export const validateUpdateIntake = (body) => {
  if (!body || typeof body !== 'object') {
    fail('Request body is required');
  }

  // ACK is immutable
  if (body.acknowledgementNumber !== undefined)
    fail('Acknowledgement number cannot be changed');

  const allowedFields = [
    'name',
    'surname',
    'phone',
    'reference',
    'serviceId',
    'customServiceName',
    'charge',
    'discount',
    'advance',
    'paymentMode',
    'paymentStatus',
    'deadline',
    'remark',
    'status',
    'confirmExistingCustomer',
  ];

  const providedFields = Object.keys(body).filter(
    (k) => body[k] !== undefined,
  );

  if (providedFields.length === 0)
    fail('At least one field is required to update');

  const unknownFields = providedFields.filter(
    (f) => !allowedFields.includes(f),
  );
  if (unknownFields.length > 0)
    fail(`Unknown field(s): ${unknownFields.join(', ')}`);

  // ---------- Customer ----------
  if (body.name !== undefined) {
    if (!isNonEmptyString(body.name)) fail('Name cannot be empty');
    if (body.name.trim().length > MAX_NAME)
      fail(`Name cannot exceed ${MAX_NAME} characters`);
    body.name = body.name.trim();
  }

  if (body.surname !== undefined) {
    if (!isNonEmptyString(body.surname))
      fail('Surname cannot be empty');
    if (body.surname.trim().length > MAX_SURNAME)
      fail(`Surname cannot exceed ${MAX_SURNAME} characters`);
    body.surname = body.surname.trim();
  }

  if (body.phone !== undefined) {
    if (!isValidPhone(body.phone))
      fail('Mobile number must be exactly 10 digits');
    body.phone = body.phone.trim();
  }

  // ---------- Reference ----------
  if (body.reference !== undefined) {
    if (
      body.reference === null ||
      body.reference === ''
    ) {
      body.reference = null;
    } else {
      if (typeof body.reference !== 'string')
        fail('Reference must be a string');
      if (body.reference.trim().length > MAX_REFERENCE)
        fail(`Reference cannot exceed ${MAX_REFERENCE} characters`);
      body.reference = body.reference.trim();
    }
  }

  // ---------- Service ----------
  if (body.serviceId !== undefined && body.serviceId !== null) {
    const sid = Number(body.serviceId);
    if (!Number.isInteger(sid) || sid <= 0)
      fail('serviceId must be a positive integer');
    body.serviceId = sid;
    body.customServiceName = null;
  }

  if (
    body.customServiceName !== undefined &&
    body.customServiceName !== null &&
    body.customServiceName !== ''
  ) {
    if (!isNonEmptyString(body.customServiceName))
      fail('customServiceName cannot be empty');
    if (
      body.customServiceName.trim().length > MAX_CUSTOM_SERVICE_NAME
    ) {
      fail(
        `Custom service name cannot exceed ${MAX_CUSTOM_SERVICE_NAME} characters`,
      );
    }
    body.customServiceName = body.customServiceName
      .trim()
      .toUpperCase();
    body.serviceId = null;
  }

  // ---------- Charge / Discount / Advance ----------
  if (body.charge !== undefined) {
    if (!isNonNegativeNumber(body.charge))
      fail('Payment charges must be a number >= 0');
  }

  if (body.discount !== undefined) {
    if (!isNonNegativeNumber(body.discount))
      fail('Discounted price must be a number >= 0');
    if (body.charge !== undefined && body.discount > body.charge)
      fail('Discounted price cannot exceed the payment charges');
  }

  if (body.advance !== undefined) {
    if (!isNonNegativeNumber(body.advance))
      fail('Advance must be a number >= 0');
  }

  // Cross-field check when all three provided
  if (
    body.charge !== undefined &&
    body.discount !== undefined &&
    body.advance !== undefined
  ) {
    const net = body.charge - body.discount;
    if (body.advance > net)
      fail('Advance cannot exceed (charges - discount)');
  }

  // ---------- Payment mode ----------
  if (
    body.paymentMode !== undefined &&
    body.paymentMode !== null &&
    body.paymentMode !== ''
  ) {
    body.paymentMode = normalizePaymentMode(body.paymentMode);
    if (!ALLOWED_PAYMENT_MODES.includes(body.paymentMode))
      fail(
        `Payment mode must be one of: ${ALLOWED_PAYMENT_MODES.join(', ')}`,
      );
  }

  // ---------- Payment status ----------
  if (body.paymentStatus !== undefined) {
    if (!isNonEmptyString(body.paymentStatus))
      fail('paymentStatus cannot be empty');
    body.paymentStatus = body.paymentStatus.trim().toUpperCase();
    if (!ALLOWED_PAYMENT_STATUSES.includes(body.paymentStatus))
      fail(
        `Payment status must be one of: ${ALLOWED_PAYMENT_STATUSES.join(', ')}`,
      );
  }

  // ---------- Deadline ----------
  if (body.deadline !== undefined) {
    if (!isNonEmptyString(body.deadline))
      fail('Deadline cannot be empty');
    if (!isValidDeadline(body.deadline))
      fail(
        'Deadline must be a valid date (YYYY-MM-DD) or a preset (+10d, +30d, +2m, custom)',
      );
    body.deadline = body.deadline.trim();
  }

  // ---------- Remark ----------
  if (body.remark !== undefined) {
    if (
      body.remark === null ||
      body.remark === ''
    ) {
      body.remark = null;
    } else {
      if (typeof body.remark !== 'string')
        fail('Remark must be a string');
      if (body.remark.trim().length > MAX_REMARK)
        fail(`Remark cannot exceed ${MAX_REMARK} characters`);
      body.remark = body.remark.trim();
    }
  }

  // ---------- Work status ----------
  if (body.status !== undefined) {
    if (!isNonEmptyString(body.status))
      fail('Status cannot be empty');
    body.status = body.status.trim().toUpperCase();
    if (!ALLOWED_WORK_STATUSES.includes(body.status))
      fail(`Status must be one of: ${ALLOWED_WORK_STATUSES.join(', ')}`);
  }
};

// ---------------------------------------------------------------------------
// QUERY
// ---------------------------------------------------------------------------

/**
 * Validate + normalize list query params.
 * @returns {{ page: number, limit: number, search: string }}
 */
export const validateListQuery = (query) => {
  const { page, limit, search } = query;

  const parsedPage = page === undefined ? 1 : Number(page);
  const parsedLimit = limit === undefined ? 10 : Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1)
    fail('page must be a positive integer');
  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    fail('limit must be a positive integer between 1 and 100');
  }
  if (search !== undefined && typeof search !== 'string')
    fail('search must be a string');

  return {
    page: parsedPage,
    limit: parsedLimit,
    search: search ? search.trim() : '',
  };
};

// ---------------------------------------------------------------------------
// ID
// ---------------------------------------------------------------------------

/** Validate and convert a path param into a positive integer ID. */
export const validateId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0)
    fail('Invalid intake ID', 400);
  return id;
};