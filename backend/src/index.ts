import { createServer } from 'http';

import { app } from './app';
import { socketIO } from './utilities/socket';

const server = createServer(app);

const PORT = process.env.PORT || 5000;

socketIO(server);

server.listen(PORT, async () => {
  console.log(`server is running on localhost:${PORT}`);
});
