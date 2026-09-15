import express from 'express';
const router = express.Router();
import * as controller from './work.controller.js';
import { validateWorkId, validateWorkListQuery, validateWorkUpdate } from './work.validation.js';

router.get('/', validateWorkListQuery, controller.getAllWorks);

router
  .route('/:work_id')
  .get(validateWorkId, controller.getOneWork)
  .patch(validateWorkId, validateWorkUpdate, controller.updateWorkStatus);

export default router;
