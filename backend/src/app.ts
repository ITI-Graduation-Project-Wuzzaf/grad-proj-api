import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerUI from 'swagger-ui-express';

import swaggerDocument from '../swagger.json';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';

export const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(helmet());
app.use(hpp());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(routes);
app.use(errorHandler);
