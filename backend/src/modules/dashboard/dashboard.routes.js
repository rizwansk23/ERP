import { Router } from 'express';

import { getDashboardSummary, getWorksByService, exportReport } from './dashboard.controller.js';

import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/summary', getDashboardSummary);
router.get('/works-by-service', getWorksByService);
router.get('/export', exportReport);

export default router;