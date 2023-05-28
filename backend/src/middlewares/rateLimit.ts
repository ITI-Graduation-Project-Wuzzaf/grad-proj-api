import rateLimit from 'express-rate-limit';

export const limiter = (maxRequests: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
  });
