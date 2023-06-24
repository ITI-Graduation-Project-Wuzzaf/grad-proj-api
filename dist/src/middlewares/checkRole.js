"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const notAuthorizedError_1 = require("../errors/notAuthorizedError");
const checkRole = (...roles) => (_req, res, next) => {
    if (!roles.includes(res.locals.role)) {
        throw new notAuthorizedError_1.NotAuthorizeError();
    }
    next();
};
exports.checkRole = checkRole;
