import { Router } from 'express';

import { authRouter } from './auth';
import { profileRouter } from './profile';
import { employerRouter } from './employer';
import { jobRouter } from './job';

const router = Router();

router.use(authRouter);
router.use(profileRouter);
router.use(employerRouter);
router.use(jobRouter);

export default router;
