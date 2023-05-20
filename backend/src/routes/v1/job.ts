import { Router } from 'express';

import { index, create, show, update, remove } from '../../controllers/job';
import { jobCreateSchema, jobUpdateSchema } from '../../utilities/validation/job';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.get('/jobs/', index);
router.post('/jobs/', requireAuth, validateRequest(jobCreateSchema), create);
router.get('/jobs/:id', show);
router.patch('/jobs/:id', requireAuth, validateRequest(jobUpdateSchema), update);
router.delete('/jobs/:id', requireAuth, remove);

export { router as jobRouter };
