import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@e-commerce-multi-vendor/error-handler';
import cookieParser from 'cookie-parser';
// import swaggerUi from 'swagger-ui-express';

const port = process.env.PORT ? Number(process.env.PORT) : 6002;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.get('/docs-json', (req, res) => {
//   res.json(swaggerSpec);
// });
// Routes
// app.use('/api', router);

const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/docs`);
});

server.on('error', (err) => {
  console.log('server Error', err);
});

app.use(errorMiddleware);
