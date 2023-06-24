"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobUpdateSchema = exports.jobCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.jobCreateSchema = joi_1.default
    .object({
    title: joi_1.default.string().max(200).required(),
    description: joi_1.default.string().max(600).required(),
    type: joi_1.default.string().valid('Part-time', 'Full-time').required(),
    location: joi_1.default.string().required(),
    category: joi_1.default.string().valid('Development', 'Design', 'Marketing', 'Business', 'Support').required(),
    min_salary: joi_1.default.number().integer().positive().empty(''),
    max_salary: joi_1.default
        .number()
        .integer()
        .positive()
        .greater(joi_1.default.ref('min_salary'))
        .message('max salary must be greater than min salary')
        .empty(''),
    experience: joi_1.default.string().max(100),
    skills: joi_1.default.array().items(joi_1.default.string()).min(2).max(30),
})
    .options({ stripUnknown: true });
exports.jobUpdateSchema = joi_1.default
    .object({
    title: joi_1.default.string().max(200),
    description: joi_1.default.string().max(600),
    type: joi_1.default.string().valid('Part-time', 'Full-time'),
    location: joi_1.default.string(),
    min_salary: joi_1.default.number().integer().positive(),
    max_salary: joi_1.default
        .number()
        .integer()
        .positive()
        .greater(joi_1.default.ref('min_salary'))
        .message('max salary must be greater than min salary'),
    experience: joi_1.default.string().max(100),
    skills: joi_1.default.array().items(joi_1.default.string()).min(2).max(30),
})
    .min(1);
