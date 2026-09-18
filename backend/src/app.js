import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { specs } from './config/swagger.config.js';
import authRoutes from './modules/auth/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import staffRoutes from './modules/staff/staff.routes.js';
import activityLogRoutes from './modules/activity-logs/activity.routes.js';
import workRoutes from './modules/works/work.routes.js';
import customerIntakeRoutes from './modules/customer-intake/customer_intake.routes.js';
import serviceRoutes from './modules/services/service.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/users', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/works', workRoutes);

app.use('/api/staff', staffRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/customer-intake', customerIntakeRoutes);
app.use('/api/service', serviceRoutes);

app.use(errorHandler);

export default app;
