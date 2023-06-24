"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPwned = void 0;
const crypto_1 = __importDefault(require("crypto"));
const isPwned = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = crypto_1.default.createHash('sha1').update(value).digest('hex').toUpperCase();
    const prefix = hashedPassword.slice(0, 5);
    const suffix = hashedPassword.slice(5);
    const url = `https://api.pwnedpasswords.com/range/${prefix}`;
    const res = yield fetch(url);
    const data = yield res.text();
    const breachedPasswords = data.split('\r\n');
    const matchingPassword = breachedPasswords.find((p) => p.includes(suffix));
    if (matchingPassword) {
        return true;
    }
    return false;
});
exports.isPwned = isPwned;
