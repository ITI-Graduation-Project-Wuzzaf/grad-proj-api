import { Router } from 'express';

import { NotFoundError } from '../../errors/notFoundError';

const router = Router();

router.all('*', (_req, _res) => {
  throw new NotFoundError();
});

export default router;
