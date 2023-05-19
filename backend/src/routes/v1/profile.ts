import { Router } from 'express';

import { show, update } from '../../controllers/profile';
import { validateRequest } from '../../middlewares/validateRequest';
import { profileSchema } from '../../utilities/validation/profile';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.get('/profiles:id', requireAuth, show);
router.patch('/profiles', requireAuth, validateRequest(profileSchema), update);

export { router as profileRouter };
