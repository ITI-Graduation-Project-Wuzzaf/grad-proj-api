import { Router } from 'express';

import { show, update } from '../../controllers/profile';
import { validateRequest } from '../../middlewares/validateRequest';
import { profileSchema } from '../../utilities/validation/profile';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';
import { fileUpload } from '../../middlewares/fileUpload';
import { currentUser } from '../../middlewares/currentUser';

const router = Router();

router.get('/profiles/:id', currentUser, requireAuth, show);

router.patch(
  '/profiles',
  currentUser,
  requireAuth,
  checkRole('user', 'admin'),
  fileUpload,
  validateRequest(profileSchema),
  update,
);

export { router as profileRouter };
