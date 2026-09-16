import express from 'express';
const router = express.Router();
import * as controller from './work.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

router.use(protect);

router.get('/', controller.getWorks);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);

export default router; 
