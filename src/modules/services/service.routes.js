import express from 'express';
import * as controller from './service.controller.js';
import {
  validateServiceId,
  validateCreateService,
  validateUpdateService,
  validateServiceStatus,
} from './service.validation.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All service endpoints require authentication.
router.use(protect);

// ---------------------------------------------------------------------------
// Reads — Admin + Staff (staff see only active services, handled in service)
// ---------------------------------------------------------------------------
router.get('/', controller.getAllServices);
router.get('/:id', validateServiceId, controller.getServiceById);

// ---------------------------------------------------------------------------
// Writes — Admin only
// ---------------------------------------------------------------------------
router.post('/', authorize('ADMIN'), validateCreateService, controller.create);

// Deprecated alias kept for backwards compatibility (was POST /createservice).
router.post(
  '/createservice',
  authorize('ADMIN'),
  validateCreateService,
  controller.create
);

router.put('/:id', authorize('ADMIN'), validateServiceId, validateUpdateService, controller.update);
router.patch(
  '/:id',
  authorize('ADMIN'),
  validateServiceId,
  validateUpdateService,
  controller.update
);
router.patch(
  '/:id/status',
  authorize('ADMIN'),
  validateServiceId,
  validateServiceStatus,
  controller.changeStatus
);
router.delete('/:id', authorize('ADMIN'), validateServiceId, controller.remove);

export default router;
