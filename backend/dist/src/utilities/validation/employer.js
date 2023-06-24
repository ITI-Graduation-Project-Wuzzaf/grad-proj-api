"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employerUpdateSchema = exports.employerSignupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.employerSignupSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(16).required(),
    confirmPassword: joi_1.default.ref('password'),
    name: joi_1.default.string().max(100).required(),
    country: joi_1.default.string().max(60),
    city: joi_1.default.string().max(60),
    description: joi_1.default.string().max(255),
    website: joi_1.default.string(),
    industry: joi_1.default.string().max(100),
    size: joi_1.default.number().integer().positive(),
});
exports.employerUpdateSchema = joi_1.default
    .object({
    country: joi_1.default.string().max(60).empty(''),
    city: joi_1.default.string().max(60).empty(''),
    description: joi_1.default.string().max(255).empty(''),
    website: joi_1.default.string().empty(''),
    industry: joi_1.default.string().max(100).empty(''),
    logo: joi_1.default.string().empty(''),
    size: joi_1.default.number().integer().positive().empty(''),
})
    .options({ stripUnknown: true })
    .min(1);
