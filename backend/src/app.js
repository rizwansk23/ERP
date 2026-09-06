import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { specs } from './config/swagger.config.js';
import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import staffRoutes from './modules/staff/staff.routes.js';
import activityLogRoutes from './modules/activity-logs/activity.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use(errorHandler);

export default app;