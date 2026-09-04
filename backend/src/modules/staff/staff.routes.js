import { Router } from 'express';

import {
  createStaff,
  getStaff,
  getSingleStaff,
  getStaffLoginCredentials,
  updateStaff,
  updateStaffStatus,
} from './staff.controller.js';

import {
  protect,
  authorize,
} from '../../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', createStaff);
router.get('/', getStaff);
router.get('/:id/credentials', getStaffLoginCredentials);
router.get('/:id', getSingleStaff);
router.patch('/:id/status', updateStaffStatus);
router.patch('/:id', updateStaff);

export default router;