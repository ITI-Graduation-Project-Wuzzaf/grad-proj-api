import { createServer } from 'http';

import { app } from './app';
import { socketIO } from './utilities/socket';

export const server = createServer(app);

const PORT = process.env.PORT || 5000;

export const io = socketIO(server);

server.listen(PORT, async () => {
  console.log(process.env.STRIPE_WH);

  console.log(`server is running on localhost:${PORT}`);
});
