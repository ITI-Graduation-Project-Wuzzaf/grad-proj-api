"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (maxRequests) => (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errors: [{ message: 'Too many requests sent from this IP, please try again later.' }] },
});
exports.limiter = limiter;
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errors: [{ message: 'Too many login attempts, please try again later.' }] },
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        return req.body.email;
    },
});
