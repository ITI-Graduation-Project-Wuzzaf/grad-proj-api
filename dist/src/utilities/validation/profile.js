"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.profileSchema = joi_1.default
    .object({
    job: joi_1.default.string().max(100).empty(''),
    country: joi_1.default.string().max(60).empty(''),
    city: joi_1.default.string().max(60).empty(''),
    university: joi_1.default.string().max(255).empty(''),
    gender: joi_1.default.string().valid('M', 'F').empty(''),
    experience: joi_1.default.string().max(100).empty(''),
    birthdate: joi_1.default.date().greater('1950-01-01').less('1-12-2010').empty(''),
    // DOB: joi.date().min('1950-01-01').max('2010-12-1'),
    profile_picture: joi_1.default.string().empty(''),
    cv: joi_1.default.string().max(250).empty(''),
    bio: joi_1.default.string().max(250).empty(''),
    skills: joi_1.default.array().items(joi_1.default.string()).min(2).max(30).empty(''),
    links: joi_1.default.array().items(joi_1.default.string()).min(1).max(2).empty(''),
    portfolio: joi_1.default.string().empty(''),
})
    .options({ stripUnknown: true })
    .min(1);
