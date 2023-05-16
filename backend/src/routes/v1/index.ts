import { Router } from 'express';
import { authRouter } from './auth';

const router = Router();

// HERE  place routers from files

router.use(authRouter);

export default router;
