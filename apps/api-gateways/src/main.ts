import express from 'express';
import cors from 'cors';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import cookieParse from 'cookie-parser';
import initializeConfig from './libs/initializeSiteConfig';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  }),
);

app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParse());
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: 'To many request, please try again latter' },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any, res: any) => ipKeyGenerator(req, res),
});
app.use(limiter);
app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/product', proxy('http://localhost:6002'));
app.use('/', proxy('http://localhost:6001'));

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  try {
    initializeConfig();
    console.log('Site config initialized successfully');
  } catch (error) {
    console.log('Failed to initialize site config', error);
  }
});
