import { Router } from 'express';

import { paymentIntent, subscription } from '../../controllers/payment';

const router = Router();

router.post('/create-payment', paymentIntent);

router.post('/subscription', subscription);

export { router as paymentRouter };
