import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';

interface UserPayload {
  id: number;
  email: string;
  role: string;
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] as string;

    const payload = verify(token, process.env.JWT_SECRET as string) as UserPayload;

    res.locals.userId = payload.id;
    res.locals.email = payload.email;
    res.locals.role = payload.role;

    next();
  } catch (err) {
    throw new BadRequestError('Access token has already expired ');
  }
};
