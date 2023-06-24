"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const customError_1 = require("./customError");
class NotFoundError extends customError_1.CustomError {
    constructor() {
        super('Route Not Found');
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not Found' }];
    }
}
exports.NotFoundError = NotFoundError;
