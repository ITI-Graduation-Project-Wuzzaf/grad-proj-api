import { Router } from 'express';

import { login, signup, isAuthed } from '../../controllers/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { loginSchema, signupSchema } from '../../utilities/validation/user';
import { limiter, loginLimiter } from '../../middlewares/rateLimit';
import { currentUser } from '../../middlewares/currentUser';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.post('/signup', limiter(7), validateRequest(signupSchema), signup);

router.post('/login', loginLimiter, validateRequest(loginSchema), login);

router.get('/is-authed', currentUser, requireAuth, isAuthed);

export { router as authRouter };
