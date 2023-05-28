import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerUI from 'swagger-ui-express';

import dotenv from 'dotenv';

dotenv.config();

import swaggerDocument from '../swagger.json';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import { fileUpload } from './middlewares/fileUpload';
import { stripeWebhook } from './controllers/payment';

export const app = express();

app.use(cors());
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(helmet());
app.use(hpp());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.post('/upload', fileUpload, (req, res) => {
  res.send('passed middleware');
});

app.use(routes);
app.use(errorHandler);
