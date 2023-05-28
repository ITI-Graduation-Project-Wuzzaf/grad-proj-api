import { Router } from 'express';

import { subscription } from '../../controllers/payment';

const router = Router();

router.post('/subscription', subscription);

export { router as paymentRouter };
