import { Router } from 'express';

import { create, update, show, jobApplications, userApplications } from '../../controllers/application';
import { appCreateSchema, appUpdateSchema } from '../../utilities/validation/application';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkRole } from '../../middlewares/checkRole';
import { fileUpload } from '../../middlewares/fileUpload';

const router = Router();

export { router as applicationRouter };

router.get('/jobs/:id/applications', checkRole('employer'), jobApplications);

router.get('/users/applications', checkRole('user'), userApplications);

router.get('/applications/:id', show);

router.post('/applications', checkRole('user'), fileUpload, validateRequest(appCreateSchema), create);

router.patch('/applications/:id', checkRole('user'), validateRequest(appUpdateSchema), update);
