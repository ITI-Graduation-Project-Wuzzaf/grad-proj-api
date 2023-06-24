"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = exports.loginSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(16).required(),
    confirmPassword: joi_1.default.ref('password'),
    first_name: joi_1.default.string().max(20).required(),
    last_name: joi_1.default.string().max(50).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(16).required(),
});
exports.contactSchema = joi_1.default.object({
    name: joi_1.default.string().max(40).min(2).required(),
    email: joi_1.default.string().email().required(),
    message: joi_1.default.string().min(10).max(400).required(),
});
