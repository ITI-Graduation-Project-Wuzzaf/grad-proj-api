import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from '../errors/notAuthorizedError';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.userId) {
    throw new NotAuthorizeError();
  }
  next();
};
