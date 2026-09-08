import swaggerJsdoc from 'swagger-jsdoc';
import config from './app.config.js';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Government ERP API',
      version: '1.0.0',
      description: 'API documentation for Government ERP system',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },

    ],
  },
  apis: ['./src/modules/**/*.swagger.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);