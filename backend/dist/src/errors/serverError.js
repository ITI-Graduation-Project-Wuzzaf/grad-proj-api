"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const customError_1 = require("./customError");
class ServerError extends customError_1.CustomError {
    constructor() {
        super('Internal server error');
        this.statusCode = 500;
        Object.setPrototypeOf(this, ServerError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Internal server error' }];
    }
}
exports.ServerError = ServerError;
