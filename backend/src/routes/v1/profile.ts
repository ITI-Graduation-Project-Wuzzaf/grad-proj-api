import { Router } from 'express';

import { update } from '../../controllers/profile';
import { validateRequest } from '../../middlewares/validateRequest';
import { profileSchema } from '../../utilities/validation/profile';

const router = Router();

router.patch('/profiles/:id', validateRequest(profileSchema), update);

export { router as profileRouter };
