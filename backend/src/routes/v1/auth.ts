import { Router } from 'express';

import { login, signup } from '../../controllers/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { loginSchema, signupSchema } from '../../utilities/validation/user';
import { limiter, loginLimiter } from '../../middlewares/rateLimit';

const router = Router();

router.post('/signup', limiter(7), validateRequest(signupSchema), signup);

router.post('/login', loginLimiter, validateRequest(loginSchema), login);

export { router as authRouter };
