import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerUI from 'swagger-ui-express';

import swaggerDocument from '../../swagger.json';

export default class ApplicationConfig {
  static init(app: express.Application) {
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(hpp());
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  }
}
