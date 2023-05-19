import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';
import { NotAuthorizeError } from '../errors/notAuthorizedError';

interface UserPayload {
  id: number;
  email: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new NotAuthorizeError();
    }

    const token = req.headers.authorization?.split(' ')[1] as string;
    const payload = verify(token, process.env.JWT_SECRET as string) as UserPayload;
    res.locals.userId = payload.id;
    res.locals.email = payload.email;
    next();
  } catch (err) {
    throw new BadRequestError('Access token has already expired ');
  }
};
