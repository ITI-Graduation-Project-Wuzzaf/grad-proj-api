import { Router } from 'express';

import { checkout } from '../../controllers/payment';
import { limiter } from '../../middlewares/rateLimit';
import { checkRole } from '../../middlewares/checkRole';

const router = Router();

router.post('/checkout', limiter(5), checkRole('employer'), checkout);

export { router as paymentRouter };
