import { NextFunction, Request, Response } from 'express';

import { NotAuthorizeError } from '../errors/notAuthorizedError';

export const checkRole =
  (...roles: string[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.role)) {
      throw new NotAuthorizeError();
    }
    next();
  };
