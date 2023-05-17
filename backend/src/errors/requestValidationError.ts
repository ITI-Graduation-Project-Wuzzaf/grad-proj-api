import { ValidationError } from 'joi';

import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
  statusCode = 422;
  constructor(public errors: ValidationError) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.details.map((err) => {
      return { field: err.path[0] + '', message: err.message };
    });
  }
}
