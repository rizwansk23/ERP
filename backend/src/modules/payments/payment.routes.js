import express from 'express';
const router = express.Router();
import * as controller from './payment.controller.js';

router.get('/:work_id', controller.getOnePayment);
router.get('/', controller.getAllPayments);
router.post('/', controller.createPayment);

export default router;
