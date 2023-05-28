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
  message: { errors: [{ message: 'Too many login attempts, please try again later.' }] },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    console.log(req.body.email);

    return req.body.email;
  },
});
