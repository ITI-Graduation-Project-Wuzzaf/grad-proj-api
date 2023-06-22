import { Router } from 'express';

import { contactUs, getNotifications, removeSavedJob, saveJob, userSavedJobs } from '../../controllers/user';

import { contactSchema } from '../../utilities/validation/user';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';
import { currentUser } from '../../middlewares/currentUser';

const router = Router();

router.post('/contact', validateRequest(contactSchema), contactUs);

router.post('/save-job', currentUser, requireAuth, checkRole('user'), saveJob);

router.delete('/remove-job', currentUser, requireAuth, checkRole('user'), removeSavedJob);

router.get('/user/jobs', currentUser, requireAuth, checkRole('user'), userSavedJobs);

router.get('/notifications', currentUser, requireAuth, getNotifications);

export { router as userRouter };
