"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondSchema = exports.appUpdateSchema = exports.appCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.appCreateSchema = joi_1.default.object({
    job_id: joi_1.default.number().integer().positive().required(),
    cv: joi_1.default.string().max(400).required(),
    cover_letter: joi_1.default.string().max(600),
    additional_info: joi_1.default.string().max(600),
});
exports.appUpdateSchema = joi_1.default
    .object({
    cv: joi_1.default.string().max(400),
    cover_letter: joi_1.default.string().max(600),
    additional_info: joi_1.default.string().max(600),
})
    .min(1);
exports.respondSchema = joi_1.default
    .object({
    status: joi_1.default.string().valid('rejected', 'in-consideration').empty(''),
    feedback: joi_1.default.string().max(400).empty(''),
})
    .options({ stripUnknown: true })
    .min(1);
