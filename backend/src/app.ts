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
import { client } from './utilities/elasticSearch';

export const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(hpp());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.post('/upload', fileUpload, (req, res) => {
  res.send('passed middleware');
});
app.get('/search', async (req, res) => {
  const query = req.body.query;
  try {
    const searchResult = await client.search({
      index: 'jobs',
      body: {
        suggest: {
          job_suggest: {
            prefix: query,
            completion: {
              field: 'title',
            },
          },
        },
      },
    });
    console.log(searchResult);
    res.json(searchResult.hits.hits);
  } catch (err) {
    console.log(err);
  }
});

app.use(routes);
app.use(errorHandler);
