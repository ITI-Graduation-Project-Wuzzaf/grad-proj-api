import { Router } from 'express';

import { signup, show, update } from '../../controllers/employer';
import { requireAuth } from '../../middlewares/requireAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { employerSignupSchema, employerUpdateSchema } from '../../utilities/validation/employer';

const router = Router();

router.get('/employers/:id', requireAuth, show);

router.post('/employers', validateRequest(employerSignupSchema), signup);

router.patch('/employers', requireAuth, validateRequest(employerUpdateSchema), update);

export { router as employerRouter };