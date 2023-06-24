"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../errors/customError");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof customError_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({ errors: [{ message: 'Something went wrong.' }] });
};
exports.default = errorHandler;
