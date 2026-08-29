import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Government ERP API',
      version: '1.0.0',
      description: 'API documentation for Government ERP system',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);