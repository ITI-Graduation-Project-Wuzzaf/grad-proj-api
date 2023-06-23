import { Router } from 'express';

import { candidateSearch, search } from '../../controllers/search';
import { currentUser } from '../../middlewares/currentUser';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkRole } from '../../middlewares/checkRole';

const router = Router();

router.get('/search', currentUser, search);

router.get('/search/candidates', currentUser, requireAuth, checkRole('employer', 'admin'), candidateSearch);

export { router as searchRouter };
