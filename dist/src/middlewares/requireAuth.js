"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const notAuthorizedError_1 = require("../errors/notAuthorizedError");
const requireAuth = (req, res, next) => {
    if (!res.locals.userId) {
        throw new notAuthorizedError_1.NotAuthorizeError();
    }
    next();
};
exports.requireAuth = requireAuth;
