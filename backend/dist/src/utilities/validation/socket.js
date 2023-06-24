"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifSchema = exports.socketSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.socketSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required(),
    role: joi_1.default.string().valid('user', 'employer', 'admin').required(),
});
exports.notifSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required(),
    role: joi_1.default.string().valid('user', 'employer', 'admin').required(),
    jobId: joi_1.default.number().integer().positive().required(),
    jobName: joi_1.default.string().max(100).required(),
    appId: joi_1.default.number().integer().positive().required(),
});
