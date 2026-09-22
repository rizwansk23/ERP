import express from 'express';
import * as controller from './work.controller.js';
import { validateWorkId, validateWorkListQuery, validateWorkUpdate } from './work.validation.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', validateWorkListQuery, controller.getAllWorks);

router
  .route('/:work_id')
  .get(validateWorkId, controller.getOneWork)
  .patch(validateWorkId, validateWorkUpdate, controller.updateWorkStatus)
  .delete(validateWorkId, controller.deleteWork);

export default router;
