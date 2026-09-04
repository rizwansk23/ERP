import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { specs } from './config/swagger.config.js';
import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;