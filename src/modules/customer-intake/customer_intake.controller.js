// ============================================================================
// CUSTOMER INTAKE — CONTROLLER
// Thin HTTP layer. No business logic here.
// Each handler:
//   1. Validates the request payload
//   2. Calls the service
//   3. Sends the response envelope { success, message, data }
// Errors bubble up via asyncHandler to the global error middleware.
// ============================================================================

import { asyncHandler } from '../../utils/asyncHandler.js';

import {
  validateCreateIntake,
  validateUpdateIntake,
  validateListQuery,
  validateId,
} from './customer_intake.validation.js';

import {
  peekAckNumber,
  peekReceiptNumber,
  suggestCustomers,
  createIntake,
  getAllIntakes,
  getIntakeById,
  updateIntake,
  deleteIntake,
} from './customer_intake.service.js';

// ---------------------------------------------------------------------------
// GET /api/customer-intake/next-ack-number
// Preview the next ACK number for display on the intake form.
// ---------------------------------------------------------------------------
export const getNextAckNumber = asyncHandler(async (req, res) => {
  const acknowledgementNumber = await peekAckNumber();

  res.status(200).json({
    success: true,
    message: 'Next acknowledgement number fetched successfully',
    data: { acknowledgementNumber },
  });
});

// ---------------------------------------------------------------------------
// GET /api/customer-intake/next-receipt-number
// Preview the next receipt number for display on the intake form.
// ---------------------------------------------------------------------------
export const getNextReceiptNumber = asyncHandler(async (req, res) => {
  const receiptNumber = await peekReceiptNumber();

  res.status(200).json({
    success: true,
    message: 'Next receipt number fetched successfully',
    data: { receiptNumber },
  });
});

// ---------------------------------------------------------------------------
// GET /api/customer-intake/customer-suggestions?q=...
// Suggest existing customers (name + phone) while staff is typing.
// ---------------------------------------------------------------------------
export const getCustomerSuggestions = asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const suggestions = await suggestCustomers(query);

  res.status(200).json({
    success: true,
    message: 'Customer suggestions fetched successfully',
    data: suggestions,
  });
});

// ---------------------------------------------------------------------------
// POST /api/customer-intake
// Create a new intake (Customer + Work + optional Payment + ActivityLog).
// ---------------------------------------------------------------------------
export const createCustomerIntake = asyncHandler(async (req, res) => {
  // Validate + normalize in place
  validateCreateIntake(req.body);

  const result = await createIntake(req.body, req.user);

  res.status(201).json({
    success: true,
    message: 'Customer intake created successfully',
    data: result,
  });
});

// ---------------------------------------------------------------------------
// GET /api/customer-intake
// List intakes with pagination + search.
// ---------------------------------------------------------------------------
export const listCustomerIntakes = asyncHandler(async (req, res) => {
  const { page, limit, search } = validateListQuery(req.query);

  const result = await getAllIntakes({ page, limit, search });

  res.status(200).json({
    success: true,
    message: 'Customer intakes fetched successfully',
    data: result.items,
    pagination: result.pagination,
  });
});

// ---------------------------------------------------------------------------
// GET /api/customer-intake/:id
// Get one intake by Work ID.
// ---------------------------------------------------------------------------
export const getSingleCustomerIntake = asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);

  const intake = await getIntakeById(id);

  res.status(200).json({
    success: true,
    message: 'Customer intake fetched successfully',
    data: intake,
  });
});

// ---------------------------------------------------------------------------
// PUT /api/customer-intake/:id
// Update an existing intake (Customer + Work + initial Payment).
// ---------------------------------------------------------------------------
export const updateCustomerIntake = asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);

  // Validate + normalize in place
  validateUpdateIntake(req.body);

  const result = await updateIntake(id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: 'Customer intake updated successfully',
    data: result,
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/customer-intake/:id
// Soft-delete an intake (Work only). Admin-only.
// ---------------------------------------------------------------------------
export const deleteCustomerIntake = asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);

  const result = await deleteIntake(id, req.user);

  res.status(200).json({
    success: true,
    message: 'Customer intake deleted successfully',
    data: result,
  });
});