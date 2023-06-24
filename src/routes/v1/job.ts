import { Router } from 'express';

import { index, create, show, update, remove, employerJobs } from '../../controllers/job';
import { jobCreateSchema, jobUpdateSchema } from '../../utilities/validation/job';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';
import { currentUser } from '../../middlewares/currentUser';

const router = Router();

router.get('/jobs/', index);

router.get('/employer/jobs', currentUser, requireAuth, checkRole('employer'), employerJobs);

router.post(
  '/jobs/',
  currentUser,
  requireAuth,
  checkRole('employer', 'admin'),
  validateRequest(jobCreateSchema),
  create,
);

router.get('/jobs/:id', show);

router.patch('/jobs/:id', currentUser, requireAuth, checkRole('employer'), validateRequest(jobUpdateSchema), update);

router.delete('/jobs/:id', currentUser, requireAuth, checkRole('employer', 'admin'), remove);

export { router as jobRouter };
