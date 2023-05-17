import 'express-async-errors';
import { app } from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`server is running on localhost:${PORT}`);
});
