import { Router } from 'express';
import { authRouter } from './auth';
import { profileRouter } from './profile';

const router = Router();

// HERE  place routers from files

router.use(authRouter);
router.use(profileRouter);

export default router;
