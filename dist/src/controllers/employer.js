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
exports.latestCandidates = exports.featuredEmployers = exports.employerDetails = exports.signup = exports.update = exports.show = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crud = __importStar(require("../utilities/crud"));
const { JWT_SECRET, JWT_ACCESS_EXPIRY } = process.env;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const employer = yield crud.show('employer', id);
    res.send(employer);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employer = yield crud.update('employer', res.locals.userId, req.body);
    res.status(200).send(employer);
});
exports.update = update;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { confirmPassword } = _a, body = __rest(_a, ["confirmPassword"]);
    const employer = yield crud.signup('employer', body);
    const accessToken = jsonwebtoken_1.default.sign({ id: employer.id, email: employer.email, role: employer.role }, JWT_SECRET + '', {
        expiresIn: JWT_ACCESS_EXPIRY + '',
    });
    res.status(201).send({ employer: employer, accessToken });
});
exports.signup = signup;
const employerDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const { employer, jobs } = yield crud.employerDetails(id);
    const { password } = employer, filteredEmployer = __rest(employer, ["password"]);
    res.send({ employer: filteredEmployer, jobs });
});
exports.employerDetails = employerDetails;
const featuredEmployers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employers = yield crud.featuredEmployers();
    res.send(employers);
});
exports.featuredEmployers = featuredEmployers;
const latestCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = res.locals.userId;
    console.log('heya');
    const candidates = yield crud.latestCandidates(id);
    res.send(candidates);
});
exports.latestCandidates = latestCandidates;
