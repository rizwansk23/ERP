import express from 'express';
const router = express.Router();
import * as controller from './business.controller.js';

router.get('/:id', controller.getOne);
router.post('/', controller.create);

export default router;
