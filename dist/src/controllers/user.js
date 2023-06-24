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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = exports.userSavedJobs = exports.removeSavedJob = exports.saveJob = exports.contactUs = void 0;
const mailing_1 = __importDefault(require("../utilities/mailing"));
const crud = __importStar(require("../utilities/crud"));
const notifCrud = __importStar(require("../utilities/notifications"));
const contactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    (0, mailing_1.default)('baselsalah2053@gmail.com', 'Jobify is happy to have you', email, name, message);
    res.send({});
});
exports.contactUs = contactUs;
const saveJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const jobId = req.body.jobId;
    yield crud.create('user_saved_job', { user_id: userId, job_id: jobId });
    res.sendStatus(204);
});
exports.saveJob = saveJob;
const removeSavedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const jobId = req.body.jobId;
    yield crud.removeSavedJob(userId, jobId);
    res.sendStatus(204);
});
exports.removeSavedJob = removeSavedJob;
const userSavedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const { pagination, jobs } = yield crud.userSavedJobs(res.locals.userId, page, 8);
    res.send({ pagination, jobs });
});
exports.userSavedJobs = userSavedJobs;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const role = res.locals.role;
    const page = Number(req.query.page) || 1;
    const { notifications, pagination } = yield notifCrud.pagination(userId, role, page);
    res.send({ pagination, notifications });
});
exports.getNotifications = getNotifications;
