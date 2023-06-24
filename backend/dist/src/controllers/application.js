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
exports.respond = exports.update = exports.create = exports.show = exports.userApplications = exports.jobApplications = void 0;
const crud = __importStar(require("../utilities/crud"));
const notAuthorizedError_1 = require("../errors/notAuthorizedError");
const notFoundError_1 = require("../errors/notFoundError");
const BadRequestError_1 = require("../errors/BadRequestError");
const appPerPage = 9;
const jobApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const jobId = +req.params.id;
    const job = (yield crud.show('job', jobId));
    if (job.employer_id !== res.locals.userId) {
        throw new notAuthorizedError_1.NotAuthorizeError();
    }
    else if (!job) {
        throw new notFoundError_1.NotFoundError();
    }
    const where = { job_id: jobId };
    const { pagination, applications } = yield crud.jobApplications(page, appPerPage, where);
    res.send({ pagination, applications });
});
exports.jobApplications = jobApplications;
const userApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const where = { user_id: res.locals.userId };
    const { pagination, applications } = yield crud.userApplications(page, appPerPage, where);
    res.send({ pagination, applications });
});
exports.userApplications = userApplications;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const application = yield crud.appDetails(id, res.locals.userId);
    res.send(application);
});
exports.show = show;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.cv === 'old') {
        const userProfile = (yield crud.show('profile', res.locals.userId));
        if (!userProfile.cv)
            throw new BadRequestError_1.BadRequestError("User Doesn't have a cv already ");
        req.body.cv = userProfile.cv;
    }
    const application = yield crud.create('application', Object.assign(Object.assign({}, req.body), { user_id: res.locals.userId })).catch((err) => {
        if (err.constraint === 'application_user_id_job_id_unique') {
            throw new BadRequestError_1.BadRequestError('User applying for the same job more than once');
        }
        throw new notFoundError_1.NotFoundError();
    });
    res.status(201).send(application);
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const application = yield crud.update('application', id, req.body, 'user_id', res.locals.userId);
    res.send(application);
});
exports.update = update;
const respond = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const title = yield crud.respond(req.body, id, res.locals.userId);
    res.send(title);
});
exports.respond = respond;
