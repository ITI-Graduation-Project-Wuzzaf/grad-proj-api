import { currentUser } from './../../middlewares/currentUser';
import { Router } from 'express';

import { signup, show, update } from '../../controllers/employer';
import { employerSignupSchema, employerUpdateSchema } from '../../utilities/validation/employer';
import { requireAuth } from '../../middlewares/requireAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkRole } from '../../middlewares/checkRole';
import { fileUpload } from '../../middlewares/fileUpload';

const router = Router();

router.get('/employers/:id', currentUser, requireAuth, show);

router.post('/employers', validateRequest(employerSignupSchema), signup);

router.patch(
  '/employers',
  currentUser,
  requireAuth,
  checkRole('employer'),
  fileUpload,
  validateRequest(employerUpdateSchema),
  update,
);

export { router as employerRouter };
