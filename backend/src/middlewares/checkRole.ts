import { NextFunction, Request, Response } from 'express';

import { NotAuthorizeError } from '../errors/notAuthorizedError';

const checkRole =
  (...roles: string[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.userRole)) {
      throw new NotAuthorizeError();
    }
    next();
  };

export default checkRole;
