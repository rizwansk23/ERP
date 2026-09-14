import express from 'express';
const router = express.Router();
import * as controller from './work.controller.js';
import { validateWorkId, validateWorkListQuery } from './work.validation.js';

router.get('/', validateWorkListQuery, controller.getAllWorks);
router.get('/:work_id', validateWorkId, controller.getOneWork);
router.post('/', controller.create);

export default router;
