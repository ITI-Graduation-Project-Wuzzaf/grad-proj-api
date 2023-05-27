import { Router } from 'express';

import { search } from '../../controllers/search';

const router = Router();

router.get('/search', search);

export { router as searchRouter };
