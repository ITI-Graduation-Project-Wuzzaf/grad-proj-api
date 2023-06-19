import { NextFunction, Request, Response } from 'express';
import { ObjectSchema, ValidationError } from 'joi';
import { RequestValidationError } from '../errors/requestValidationError';

export const validateRequest = (schema: ObjectSchema) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const value = await schema.validateAsync(req.body, { abortEarly: false });

    req.body = value;
  } catch (err) {
    if (err instanceof ValidationError) throw new RequestValidationError(err);
  }

  next();
};
