import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';
import { NotAuthorizeError } from '../errors/notAuthorizedError';

interface UserPayload {
  id: number;
  email: string;
  role: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw new NotAuthorizeError();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] as string;

    const payload = verify(token, process.env.JWT_SECRET as string) as UserPayload;

    console.log('pew pew pew ewpepwpe');
    res.locals.userId = payload.id;
    res.locals.role = payload.role;
    next();
  } catch (err) {
    throw new BadRequestError('Access token has already expired ');
  }
};
