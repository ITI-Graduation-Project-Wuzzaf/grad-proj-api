import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../errors/customError';

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void | Response => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(400).send({ errors: [{ message: 'Something went wrong.' }] });
};

export default errorHandler;
