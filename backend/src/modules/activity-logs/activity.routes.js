import { Router } from 'express';

import {
  getActivityLogs,
  getSingleActivityLog,
  getUserActivityLogs,
  deleteActivityLog,
} from './activity.controller.js';

import {
  protect,
  authorize,
} from '../../middleware/auth.middleware.js'
const router = Router();

// All activity-log APIs require authentication
router.use(protect);

// Only ADMIN can view or manage activity logs
router.use(authorize('ADMIN'));

router.get('/', getActivityLogs);

router.get('/user/:userId', getUserActivityLogs);

router.get('/:id', getSingleActivityLog);

router.delete('/:id', deleteActivityLog);

export default router;