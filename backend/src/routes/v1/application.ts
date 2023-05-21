import { Router } from 'express';
import { checkRole } from '../../middlewares/checkRole';
import { jobApplications, show, userApplications } from '../../controllers/application';

const router = Router();

export { router as applicationRouter };

router.get('/jobs/:id/applications', checkRole('employer'), jobApplications);

router.get('/users/applications', checkRole('user'), userApplications);

router.get('/applications/:id', show);

router.post('/applications', checkRole('user'));

router.patch('/applications/:id', checkRole('user'));

// router.patch('/applications/:id');
