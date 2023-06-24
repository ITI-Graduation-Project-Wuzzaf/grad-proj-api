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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeJob = exports.jobs = exports.removeEmployer = exports.employers = exports.removeUser = exports.users = void 0;
const crud = __importStar(require("../utilities/crud"));
const perPage = 20;
const users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const { pagination, instances } = yield crud.pagination('user_account', page, perPage);
    res.send({ pagination, users: instances });
});
exports.users = users;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield crud.remove('profile', +id);
    yield crud.remove('user_account', +id);
    res.sendStatus(204);
});
exports.removeUser = removeUser;
const employers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const { pagination, instances } = yield crud.pagination('employer', page, perPage);
    res.send({ pagination, employers: instances });
});
exports.employers = employers;
const removeEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield crud.remove('employer', +id);
    res.sendStatus(204);
});
exports.removeEmployer = removeEmployer;
const jobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const { pagination, instances } = yield crud.pagination('job', page, perPage);
    res.send({ pagination, jobs: instances });
});
exports.jobs = jobs;
const removeJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield crud.remove('job', +id);
    res.sendStatus(204);
});
exports.removeJob = removeJob;
