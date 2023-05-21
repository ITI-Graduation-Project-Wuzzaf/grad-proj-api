import { Router } from 'express';

import { index, create, show, update, remove } from '../../controllers/job';
import { jobCreateSchema, jobUpdateSchema } from '../../utilities/validation/job';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';

const router = Router();

router.get('/jobs/', index);
router.post('/jobs/', requireAuth, checkRole('employer', 'admin'), validateRequest(jobCreateSchema), create);
router.get('/jobs/:id', show);
router.patch('/jobs/:id', requireAuth, checkRole('employer'), validateRequest(jobUpdateSchema), update);
router.delete('/jobs/:id', requireAuth, checkRole('employer', 'admin'), remove);

export { router as jobRouter };
