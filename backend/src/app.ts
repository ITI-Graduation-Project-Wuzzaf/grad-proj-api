import express from 'express';
import 'express-async-errors';

import ApplicationConfig from './config/app-conf';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';

export const app = express();
const PORT = process.env.PORT || 5000;

ApplicationConfig.init(app);

app.use(routes);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`server is running on localhost:${PORT}`);
});
