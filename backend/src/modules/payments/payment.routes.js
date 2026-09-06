import express from 'express';
const router = express.Router();
import * as controller from './payment.controller.js';

router.route('/:work_id').post(controller.createPayment).get(controller.getOnePayment);
router.get('/', controller.getAllPayments);

export default router;
