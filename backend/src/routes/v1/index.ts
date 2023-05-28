import { Router } from 'express';

import { authRouter } from './auth';
import { profileRouter } from './profile';
import { employerRouter } from './employer';
import { jobRouter } from './job';
import { applicationRouter } from './application';
import { searchRouter } from './search';
import { paymentRouter } from './payment';

import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.use(authRouter);
router.use(profileRouter);
router.use(employerRouter);
router.use(jobRouter);
router.use(searchRouter);
router.use(requireAuth, applicationRouter);
router.use(paymentRouter);

export default router;
