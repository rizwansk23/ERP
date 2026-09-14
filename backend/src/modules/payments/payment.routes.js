import express from 'express';
import * as controller from './payment.controller.js';
import {
  validateCreatePayment,
  validatePaymentListQuery,
  validateWorkIdParam,
} from './payment.validation.js';

const router = express.Router();

router.get('/', validatePaymentListQuery, controller.getAllPayments);

router
  .route('/:work_id')
  .get(validateWorkIdParam, controller.getOnePayment)
  .post(validateWorkIdParam, validateCreatePayment, controller.createPayment);

export default router;
