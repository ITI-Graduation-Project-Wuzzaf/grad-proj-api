import { NextFunction, Request, Response } from 'express';
import { ObjectSchema, ValidationError } from 'joi';
import { RequestValidationError } from '../errors/requestValidationError';

export const validateRequest = (schema: ObjectSchema) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    if (err instanceof ValidationError) throw new RequestValidationError(err);
  }

  next();
};
