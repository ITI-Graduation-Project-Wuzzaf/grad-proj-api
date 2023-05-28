import rateLimit from 'express-rate-limit';

export const limiter = (maxRequests: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests sent from this IP, please try again later.',
  });

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  keyGenerator: (_req, res) => {
    console.log(res.locals.userId + res.locals.role);

    return res.locals.userId + res.locals.role;
  },
});
