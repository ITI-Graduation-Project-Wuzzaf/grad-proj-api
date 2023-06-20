import { createServer } from 'http';

import { app } from './app';

export const server = createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`server is running on localhost:${PORT}`);
});
