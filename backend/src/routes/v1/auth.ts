import { Router } from 'express';
const router = Router();

router.get('/users', async (_req, _res) => {
  _res.send({});
});

export { router as authRouter };
