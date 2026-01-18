import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products Service API',
      version: '1.0.0',
      description: 'Products microservice documentation',
    },
    servers: [
      {
        url: 'http://localhost:6002',
      },
    ],
  },

  apis: ['apps/product-service/src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
