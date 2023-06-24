"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const BadRequestError_1 = require("../errors/BadRequestError");
const currentUser = (req, res, next) => {
    var _a;
    if (!req.headers.authorization) {
        return next();
    }
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        res.locals.userId = payload.id;
        res.locals.email = payload.email;
        res.locals.role = payload.role;
        next();
    }
    catch (err) {
        throw new BadRequestError_1.BadRequestError('Access token has already expired ');
    }
};
exports.currentUser = currentUser;
