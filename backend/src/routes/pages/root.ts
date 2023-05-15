import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send(`<h2>Hello World</h2>`);
});

export default router;
