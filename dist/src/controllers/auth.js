"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthed = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const knex_1 = __importDefault(require("../../db/knex"));
const crud = __importStar(require("../utilities/crud"));
const BadRequestError_1 = require("../errors/BadRequestError");
const { PEPPER, JWT_SECRET, JWT_ACCESS_EXPIRY } = process.env;
// HERE  signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { confirmPassword } = _a, body = __rest(_a, ["confirmPassword"]);
    const user = yield crud.signup('user_account', body);
    yield (0, knex_1.default)('profile').insert({ id: user.id });
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET + '', {
        expiresIn: JWT_ACCESS_EXPIRY + '',
    });
    res.status(201).send({ user: user, accessToken });
});
exports.signup = signup;
// HERE  LOGIN
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield crud.searchAccounts(email);
    if (!existingUser) {
        throw new BadRequestError_1.BadRequestError('Invalid email or password.');
    }
    const isMatched = yield bcrypt_1.default.compare(password + PEPPER, existingUser.password);
    if (!isMatched) {
        throw new BadRequestError_1.BadRequestError('Invalid email or password.');
    }
    const { password: omitted } = existingUser, user = __rest(existingUser, ["password"]);
    const accessToken = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role }, JWT_SECRET + '', {
        expiresIn: JWT_ACCESS_EXPIRY + '',
    });
    res.status(200).send({ user, accessToken });
});
exports.login = login;
// export const logout = (req: Request, res: Response) => {};
const isAuthed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = res.locals.email;
    const user = yield crud.searchAccounts(email);
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET + '', {
        expiresIn: JWT_ACCESS_EXPIRY + '',
    });
    res.status(200).send({ user, accessToken });
});
exports.isAuthed = isAuthed;
