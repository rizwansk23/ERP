import express from 'express';

import * as controller from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', controller.login);

router.post('/logout', protect, controller.logout);

router.get('/me', protect, controller.getMe);

router.post('/change-password', protect, controller.changePassword);

export default router;