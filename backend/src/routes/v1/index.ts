import { checkRole } from './../../middlewares/checkRole';
import { Router } from 'express';

import { authRouter } from './auth';
import { profileRouter } from './profile';
import { employerRouter } from './employer';
import { jobRouter } from './job';
import { applicationRouter } from './application';
import { userRouter } from './user';
import { searchRouter } from './search';
import { paymentRouter } from './payment';

import { requireAuth } from '../../middlewares/requireAuth';
import { currentUser } from '../../middlewares/currentUser';
import { adminRouter } from './admin';

const router = Router();

router.use(authRouter);
router.use(profileRouter);
router.use(employerRouter);
router.use(jobRouter);
router.use(searchRouter);
router.use(userRouter);
router.use(currentUser, requireAuth, applicationRouter);
router.use(paymentRouter);
router.use(checkRole('admin'), adminRouter);

export default router;
