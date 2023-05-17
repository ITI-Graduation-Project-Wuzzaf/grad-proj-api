import { Router } from 'express';

import { login, signup } from '../../controllers/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { loginSchema, signupSchema } from '../../utilities/validation/user';

const router = Router();

router.post('/signup', validateRequest(signupSchema), signup);

router.post('/login', validateRequest(loginSchema), login);

export { router as authRouter };
