import { Router } from 'express';

import { authRouter } from './auth';
import { profileRouter } from './profile';
import { employerRouter } from './employer';

const router = Router();

router.use(authRouter);
router.use(profileRouter);
router.use(employerRouter);

export default router;
