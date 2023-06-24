"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizeError = void 0;
const customError_1 = require("./customError");
class NotAuthorizeError extends customError_1.CustomError {
    constructor() {
        super('Not Authorized');
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizeError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not Authorized' }];
    }
}
exports.NotAuthorizeError = NotAuthorizeError;
