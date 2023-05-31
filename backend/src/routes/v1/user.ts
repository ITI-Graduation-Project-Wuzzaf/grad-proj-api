import { Router } from 'express';

import { contactUs } from '../../controllers/user';

import { requireAuth } from '../../middlewares/requireAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { contactSchema } from '../../utilities/validation/user';

const router = Router();

router.post('/contact', requireAuth, validateRequest(contactSchema), contactUs);

export { router as userRouter };
