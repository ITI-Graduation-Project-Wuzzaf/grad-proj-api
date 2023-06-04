import { Router } from 'express';

import { contactUs } from '../../controllers/user';

import { validateRequest } from '../../middlewares/validateRequest';
import { contactSchema } from '../../utilities/validation/user';

const router = Router();

router.post('/contact', validateRequest(contactSchema), contactUs);

export { router as userRouter };
