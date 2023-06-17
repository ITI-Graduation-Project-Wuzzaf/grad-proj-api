import { Router } from 'express';

import { search } from '../../controllers/search';
import { currentUser } from '../../middlewares/currentUser';

const router = Router();

router.get('/search', currentUser, search);

export { router as searchRouter };
