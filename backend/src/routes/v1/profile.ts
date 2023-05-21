import { Router } from 'express';

import { show, update } from '../../controllers/profile';
import { validateRequest } from '../../middlewares/validateRequest';
import { profileSchema } from '../../utilities/validation/profile';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';

const router = Router();

router.get('/profiles/:id', requireAuth, show);
router.patch('/profiles', requireAuth, checkRole('user'), validateRequest(profileSchema), update);

export { router as profileRouter };
