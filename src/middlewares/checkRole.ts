import { NextFunction, Request, Response } from 'express';

import { NotAuthorizeError } from '../errors/notAuthorizedError';

type roles = 'user' | 'employer' | 'admin';

export const checkRole =
  (...roles: roles[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.role)) {
      throw new NotAuthorizeError();
    }
    next();
  };
