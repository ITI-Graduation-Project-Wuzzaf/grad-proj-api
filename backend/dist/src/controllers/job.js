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
exports.remove = exports.update = exports.show = exports.create = exports.employerJobs = exports.index = void 0;
const crud = __importStar(require("../utilities/crud"));
const owner = 'employer_id';
const jobsPerPage = 6;
// const page = Number(req.query.page) || 1;
// const { pagination, instances } = await crud.pagination('job', page, jobsPerPage);
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // IMPORTANT  we still need to know what will be the search target
    // const query = (req.query.query as string) || '';
    const page = Number(req.query.page) || 1;
    const { pagination, instances } = yield crud.pagination('job', page, jobsPerPage);
    res.send({ pagination, jobs: instances });
});
exports.index = index;
const employerJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const { pagination, jobs } = yield crud.employerJobs(res.locals.userId, page, jobsPerPage);
    res.send({ pagination, jobs });
});
exports.employerJobs = employerJobs;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield crud.create('job', Object.assign(Object.assign({}, req.body), { employer_id: res.locals.userId }));
    res.status(201).send(job);
});
exports.create = create;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const job = yield crud.jobDetails(id);
    res.send(job);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const job = yield crud.update('job', id, req.body, owner, res.locals.userId);
    res.send(job);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    yield crud.remove('job', id, owner, res.locals.userId);
    res.send(`Job ${id} has been deleted.`);
});
exports.remove = remove;
