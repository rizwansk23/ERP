import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.config.js';
import authRoutes from './modules/auth/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

export default app;
