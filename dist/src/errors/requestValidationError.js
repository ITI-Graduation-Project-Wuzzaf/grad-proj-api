"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const customError_1 = require("./customError");
class RequestValidationError extends customError_1.CustomError {
    constructor(errors) {
        super('Invalid request parameters');
        this.errors = errors;
        this.statusCode = 422;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.details.map((err) => {
            return { field: err.path[0] + '', message: err.message };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
