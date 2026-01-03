// src/config/swaggerOptions.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API with Swagger',
      version: '1.0.0',
      description: 'API documentation using Swagger JSDoc',
    },
    servers: [
      {
        url: 'http://localhost:6001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to your route and model files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
