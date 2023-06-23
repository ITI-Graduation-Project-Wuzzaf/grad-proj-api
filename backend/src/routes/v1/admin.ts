import { Router } from 'express';

import { employers, jobs, removeEmployer, removeJob, removeUser, users } from '../../controllers/admin';

const router = Router();

router.get('/admin/users', users);
router.delete('/admin/users/:id', removeUser);

router.get('/admin/employers', employers);
router.delete('/admin/employers/:id', removeEmployer);

router.get('/admin/jobs', jobs);
router.delete('/admin/jobs/:id', removeJob);

export { router as adminRouter };
