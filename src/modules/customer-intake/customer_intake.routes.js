// ============================================================================
// CUSTOMER INTAKE — ROUTES
// All routes require authentication (protect).
// DELETE is admin-only (authorize('ADMIN')).
// ============================================================================

import { Router } from 'express';

import {
  protect,
  authorize,
} from '../../middleware/auth.middleware.js';

import {
  getNextAckNumber,
  getNextReceiptNumber,
  getCustomerSuggestions,
  createCustomerIntake,
  listCustomerIntakes,
  getSingleCustomerIntake,
  updateCustomerIntake,
  deleteCustomerIntake,
} from './customer_intake.controller.js';

const router = Router();

// All intake endpoints require a valid JWT.
router.use(protect);

// ---------------------------------------------------------------------------
// Static routes — MUST come before '/:id' to avoid being matched as :id
// ---------------------------------------------------------------------------

// Preview next ACK number (used by the frontend to pre-fill the form).
router.get('/next-ack-number', getNextAckNumber);

// Preview next receipt number (used by the frontend before saving).
router.get('/next-receipt-number', getNextReceiptNumber);

// Suggest existing customers by name / surname / phone (type-ahead dropdown).
router.get('/customer-suggestions', getCustomerSuggestions);

// ---------------------------------------------------------------------------
// CRUD routes
// ---------------------------------------------------------------------------

// Create a new intake (Admin + Staff).
router.post('/', createCustomerIntake);

// List intakes with pagination + search (Admin + Staff).
router.get('/', listCustomerIntakes);

// Get one intake by Work ID (Admin + Staff).
router.get('/:id', getSingleCustomerIntake);

// Update an intake (Admin + Staff).
router.put('/:id', updateCustomerIntake);

// Soft-delete an intake (Admin only).
router.delete('/:id', authorize('ADMIN'), deleteCustomerIntake);

export default router;