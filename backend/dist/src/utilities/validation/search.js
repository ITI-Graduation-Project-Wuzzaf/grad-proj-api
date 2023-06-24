"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.searchSchema = joi_1.default.object({
    q: joi_1.default.string().max(400).empty(''),
    cate: joi_1.default.string().max(50).empty(''),
    page: joi_1.default.number().min(1).default(1),
    size: joi_1.default.number().min(1).max(20).default(6),
});
