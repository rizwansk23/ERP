import express from 'express';
const router = express.Router();
import * as controller from './work.controller.js';
import { validateWorkListQuery } from './work.validation.js';

router.get('/',validateWorkListQuery, controller.getAllWork);
router.post('/', controller.create);

export default router;
