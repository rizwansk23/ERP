import express from 'express';
import * as controller from './service.controller.js';
import { protect,authorize } from '../../middleware/auth.middleware.js';
 
const router = express.Router();

// router.use(protect);

router.get('/', controller.getAllServices);
router.post('/', controller.create);

export default router;
