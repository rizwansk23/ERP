import express from 'express';
const router = express.Router();
import * as controller from './auth.controller.js';


router.get('/:id', controller.getOne);

router.post('/', controller.create);

export default router;
