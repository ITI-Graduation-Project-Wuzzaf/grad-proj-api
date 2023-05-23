import { CustomError } from './customError';

export class ServerError extends CustomError {
  statusCode = 500;
  constructor() {
    super('Internal server error');
    Object.setPrototypeOf(this, ServerError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Internal server error' }];
  }
}
