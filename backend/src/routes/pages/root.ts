import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send(`<h2>Welcome to our app jobify</h2>
  <p>To see all available endpoints: </p>
  <a href="/api-docs">Here</a>`);
});

export default router;
