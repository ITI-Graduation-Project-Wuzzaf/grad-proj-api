import { Router } from 'express';

import { contactUs, saveJob, userSavedJobs } from '../../controllers/user';

import { contactSchema } from '../../utilities/validation/user';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';

const router = Router();

router.post('/contact', validateRequest(contactSchema), contactUs);

router.post('/save', requireAuth, checkRole('user'), saveJob);

router.get('/user/jobs', requireAuth, checkRole('user'), userSavedJobs);

export { router as userRouter };
