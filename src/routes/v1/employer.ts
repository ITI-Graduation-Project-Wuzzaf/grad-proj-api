import { currentUser } from './../../middlewares/currentUser';
import { Router } from 'express';

import { signup, show, update, employerDetails, featuredEmployers, latestCandidates } from '../../controllers/employer';
import { employerSignupSchema, employerUpdateSchema } from '../../utilities/validation/employer';
import { requireAuth } from '../../middlewares/requireAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkRole } from '../../middlewares/checkRole';
import { fileUpload } from '../../middlewares/fileUpload';

const router = Router();

router.get('/employers/:id', show);

router.get('/employers/:id/details', currentUser, requireAuth, employerDetails);

router.get('/featured/employers', featuredEmployers);

router.get('/candidates/employers', currentUser, requireAuth, checkRole('employer'), latestCandidates);

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
