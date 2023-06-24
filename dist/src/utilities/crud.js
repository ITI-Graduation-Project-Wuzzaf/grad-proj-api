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
exports.candidateSearch = exports.search = exports.profileData = exports.appDetails = exports.latestCandidates = exports.featuredEmployers = exports.employerDetails = exports.jobDetails = exports.respond = exports.userApplications = exports.jobApplications = exports.removeSavedJob = exports.userSavedJobs = exports.employerJobs = exports.searchAccounts = exports.signup = exports.remove = exports.update = exports.create = exports.show = exports.pagination = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const knex_1 = __importDefault(require("../../db/knex"));
const BadRequestError_1 = require("../errors/BadRequestError");
const notFoundError_1 = require("../errors/notFoundError");
const preventPwned_1 = require("./preventPwned");
const { SR, PEPPER } = process.env;
const pagination = (table, page, perPage, where) => __awaiter(void 0, void 0, void 0, function* () {
    const q1 = (0, knex_1.default)(table);
    const q2 = (0, knex_1.default)(table);
    if (where) {
        q1.where(where);
        q2.where(where);
    }
    const skip = (page - 1) * perPage;
    const total = +(yield q1.count('id'))[0].count;
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    const instances = yield q2.limit(perPage).offset(skip);
    return { pagination: { page, next, prev, numberOfPages, total }, instances };
});
exports.pagination = pagination;
const show = (table, id) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = yield knex_1.default.select('*').from(table).where({ id }).first();
    if (!instance) {
        throw new notFoundError_1.NotFoundError();
    }
    return instance;
});
exports.show = show;
const create = (table, body) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = yield (0, knex_1.default)(table).insert(body).returning('*');
    return instance[0];
});
exports.create = create;
const update = (table, id, body, col, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, knex_1.default)(table).where({ id });
    if (col) {
        query.andWhere(col, owner);
    }
    const instance = yield query.update(body).returning('*');
    if (!instance.length) {
        throw new notFoundError_1.NotFoundError();
    }
    return instance[0];
});
exports.update = update;
const remove = (table, id, col, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, knex_1.default)(table).where({ id });
    if (col) {
        query.andWhere(col, owner);
    }
    const instance = yield query.delete().returning('id');
    if (!instance.length) {
        throw new notFoundError_1.NotFoundError();
    }
});
exports.remove = remove;
const signup = (table, body) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield (0, exports.searchAccounts)(body.email);
    if (existingUser) {
        throw new BadRequestError_1.BadRequestError(`Email: ${body.email} is already used`);
    }
    const isBreached = yield (0, preventPwned_1.isPwned)(body.password);
    if (isBreached)
        throw new BadRequestError_1.BadRequestError('Password is vulnerable, Please use another password.');
    const hashedPassword = yield bcrypt_1.default.hash(body.password + PEPPER, Number(SR));
    const instance = yield (0, knex_1.default)(table)
        .insert(Object.assign(Object.assign({}, body), { password: hashedPassword }))
        .returning('*');
    const _a = instance[0], { password } = _a, user = __rest(_a, ["password"]);
    return user;
});
exports.signup = signup;
const searchAccounts = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield knex_1.default.select('*').from('user_account').where('email', 'ILIKE', email);
    if (existingUser[0]) {
        return existingUser[0];
    }
    const existingEmp = yield knex_1.default.select('*').from('employer').where('email', 'ILIKE', email);
    return existingEmp[0];
});
exports.searchAccounts = searchAccounts;
// for single specific entity
const employerJobs = (employerId, page, perPage) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { employer_id: employerId };
    const skip = (page - 1) * perPage;
    const total = +(yield (0, knex_1.default)('job').where(where).count('id'))[0].count;
    const jobs = yield (0, knex_1.default)('job')
        .select('job.*')
        .count('application.id as applications_number')
        .leftJoin('application', 'job.id', '=', 'application.job_id')
        .where(where)
        .groupBy('job.id')
        .limit(perPage)
        .offset(skip);
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    return { pagination: { page, next, prev, numberOfPages, total }, jobs };
});
exports.employerJobs = employerJobs;
const userSavedJobs = (userId, page, perPage) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { user_id: userId };
    const skip = (page - 1) * perPage;
    const total = +(yield (0, knex_1.default)('job').join('user_saved_job', 'job.id', '=', 'user_saved_job.job_id').where(where).count('title'))[0].count;
    const jobs = yield (0, knex_1.default)('job')
        .select('job.*')
        .join('user_saved_job', 'job.id', '=', 'user_saved_job.job_id')
        .where(where)
        .limit(perPage)
        .offset(skip);
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    return { pagination: { page, next, prev, numberOfPages, total }, jobs };
});
exports.userSavedJobs = userSavedJobs;
const removeSavedJob = (userId, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { user_id: userId, job_id: jobId };
    const instance = yield (0, knex_1.default)('user_saved_job').delete().where(where).returning('id');
    if (!instance.length) {
        throw new notFoundError_1.NotFoundError();
    }
});
exports.removeSavedJob = removeSavedJob;
const jobApplications = (page, perPage, where) => __awaiter(void 0, void 0, void 0, function* () {
    const q1 = (0, knex_1.default)('application').where(where);
    const q2 = q1.clone();
    const total = +(yield q1.count('id'))[0].count;
    const skip = (page - 1) * perPage;
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    const applications = yield q2
        .join('user_account', 'application.user_id', 'user_account.id')
        .select('application.*', 'first_name', 'last_name', 'email')
        .limit(perPage)
        .offset(skip);
    return { pagination: { page, next, prev, numberOfPages, total }, applications };
});
exports.jobApplications = jobApplications;
const userApplications = (page, perPage, where) => __awaiter(void 0, void 0, void 0, function* () {
    const q1 = (0, knex_1.default)('application').where(where);
    const q2 = q1.clone();
    const total = +(yield q1.count('id'))[0].count;
    const skip = (page - 1) * perPage;
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    const applications = yield q2
        .join('job', 'application.job_id', 'job.id')
        .join('employer', 'job.employer_id', 'employer.id')
        .select('application.*', 'title', 'name')
        .limit(perPage)
        .offset(skip);
    return { pagination: { page, next, prev, numberOfPages, total }, applications };
});
exports.userApplications = userApplications;
const respond = (body, id, employer_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, knex_1.default)('application')
        .update(body)
        .whereIn('job_id', function () {
        this.select('id').from('job').where({ employer_id });
    })
        .where('application.id', id)
        .returning('job_id');
    if (!result.length) {
        throw new notFoundError_1.NotFoundError();
    }
    const jobName = yield (0, knex_1.default)('job').select('title').where({ id: result[0].job_id });
    return jobName[0];
});
exports.respond = respond;
const jobDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = yield (0, knex_1.default)('job')
        .join('employer', 'job.employer_id', '=', 'employer.id')
        .select('name', 'logo', 'job.*')
        .where('job.id', id);
    if (!instance) {
        throw new notFoundError_1.NotFoundError();
    }
    return instance[0];
});
exports.jobDetails = jobDetails;
const employerDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const employer = yield (0, knex_1.default)('employer').select('*').where({ id }).first();
    if (!employer) {
        throw new notFoundError_1.NotFoundError();
    }
    const jobs = yield (0, knex_1.default)('job').select('*').where({ employer_id: id });
    return { employer, jobs };
});
exports.employerDetails = employerDetails;
const featuredEmployers = () => __awaiter(void 0, void 0, void 0, function* () {
    const employers = yield (0, knex_1.default)('employer')
        .select('id', 'name', 'industry', 'logo')
        .limit(4)
        .where({ featured: true })
        .orderBy('size', 'desc');
    return employers;
});
exports.featuredEmployers = featuredEmployers;
const latestCandidates = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const employers = yield (0, knex_1.default)('application AS a')
        .join('job AS j', 'a.job_id', 'j.id')
        .join('user_account AS u', 'a.user_id', 'u.id')
        .select('u.id', 'first_name', 'last_name', 'title', 'a.created_at')
        .limit(6)
        .where({ employer_id: id })
        .orderBy('a.created_at', 'DESC');
    return employers;
});
exports.latestCandidates = latestCandidates;
const appDetails = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield (0, knex_1.default)('application')
        .join('user_account', 'application.user_id', '=', 'user_account.id')
        .join('job', 'application.job_id', '=', 'job.id')
        .where('application.id', id)
        .andWhere(function () {
        this.where('user_account.id', userId).orWhere('job.employer_id', userId);
    })
        .select('first_name', 'last_name', 'email', 'application.*', 'title');
    if (!application[0]) {
        throw new notFoundError_1.NotFoundError();
    }
    return application[0];
});
exports.appDetails = appDetails;
const profileData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, knex_1.default)('profile')
        .join('user_account', 'profile.id', 'user_account.id')
        .where('profile.id', id)
        .select('profile.*', 'first_name', 'last_name', 'email');
    return profile[0];
});
exports.profileData = profileData;
// FTS
const search = (page, perPage, userId, query, category) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * perPage;
    const q = (0, knex_1.default)('job').join('employer', 'job.employer_id', '=', 'employer.id');
    if (query) {
        q.whereRaw('to_tsvector(title) || to_tsvector(name) || to_tsvector(job.description) @@ to_tsquery(?)', [
            `'${query}':*`,
        ]);
    }
    if (category) {
        q.whereRaw(`to_tsvector(category) @@ to_tsquery(?)`, [category]);
    }
    const q2 = q.clone();
    const total = +(yield q2.count('title'))[0].count;
    if (userId) {
        q.select(knex_1.default.raw('CASE WHEN usj.user_id IS NOT NULL THEN true ELSE FALSE END AS is_saved')).leftJoin('user_saved_job as usj', function () {
            this.on('job.id', '=', 'usj.job_id').andOnVal('usj.user_id', '=', userId);
        });
    }
    const jobs = yield q
        .select('job.*', 'employer.name', 'employer.logo')
        .limit(perPage)
        .offset(skip)
        .orderBy('featured', 'desc');
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    return { pagination: { page, next, prev, numberOfPages, total }, jobs };
});
exports.search = search;
const candidateSearch = (page, perPage, query) => __awaiter(void 0, void 0, void 0, function* () {
    const q = (0, knex_1.default)('profile')
        .join('user_account', 'profile.id', 'user_account.id')
        .whereRaw("to_tsvector(first_name||' '||email||' '||coalesce(country,'')||' '||coalesce(university,'')||' '||coalesce(cast(skills as TEXT),''))  @@ to_tsquery(?)", [`'${query}':*`]);
    const q2 = q.clone();
    const total = +(yield q2.count('email'))[0].count;
    const skip = (page - 1) * perPage;
    const candidates = yield q
        .select('profile.*', 'user_account.first_name', 'user_account.last_name')
        .limit(perPage)
        .offset(skip);
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    return { pagination: { page, next, prev, numberOfPages, total }, candidates };
});
exports.candidateSearch = candidateSearch;
