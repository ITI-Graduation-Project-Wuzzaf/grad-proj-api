import { Router } from 'express';

import { checkout } from '../../controllers/payment';
import { limiter } from '../../middlewares/rateLimit';

const router = Router();

router.post('/checkout', limiter(5), checkout);

export { router as paymentRouter };
