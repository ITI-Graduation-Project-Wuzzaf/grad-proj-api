import { Router } from 'express';

import { authRouter } from './auth';
import { profileRouter } from './profile';
import { employerRouter } from './employer';
import { jobRouter } from './job';
import checkRole from '../../middlewares/checkRole';

const router = Router();

router.use(authRouter);
router.use(profileRouter);
router.use(employerRouter);
router.use(checkRole('employer', 'admin'), jobRouter);

export default router;
