import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest = (schema: ObjectSchema) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: true });
  } catch (err) {
    throw new Error('validation error');
  }
  next();
};
