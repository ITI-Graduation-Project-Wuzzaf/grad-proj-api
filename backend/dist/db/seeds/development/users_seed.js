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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const bcrypt_1 = require("bcrypt");
const { PASSWORD, PEPPER, SR } = process.env;
const password = (0, bcrypt_1.hashSync)(`${PASSWORD}${PEPPER}`, Number(SR));
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        yield knex('profile').del();
        yield knex('user_account').del();
        // Inserts seed entries
        yield knex('user_account').insert([
            { id: 1, email: 'bassel@test.com', password, first_name: 'Bassel', last_name: 'Salah', role: 'admin' },
            { id: 2, email: 'hussien@test.com', password, first_name: 'Hussien', last_name: 'Tarek', role: 'admin' },
            { id: 3, email: 'youssef@test.com', password, first_name: 'Youssef', last_name: 'Said', role: 'admin' },
            { id: 4, email: 'noran@test.com', password, first_name: 'Noran', last_name: 'Nabil', role: 'admin' },
            { id: 5, email: 'rewan@test.com', password, first_name: 'Rewan', last_name: 'Hamed', role: 'admin' },
        ]);
        yield knex.raw("select setval('user_account_id_seq', max(id)) from user_account");
        //? HERE  PROFILE
        yield knex('profile').insert([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]);
        //? HERE  EMPLOYER
        yield knex('employer').insert([
            { id: 1, email: 'jobify@company.com', password, name: 'Jobify' },
            { id: 2, email: 'Portal@company.com', password, name: 'Portal' },
        ]);
        yield knex.raw("select setval('employer_id_seq', max(id)) from employer");
        //? HERE  JOB
        yield knex('job').insert([
            {
                id: 1,
                title: 'DevOps',
                description: 'Expert Devops',
                location: 'Cairo',
                type: 'Part-time',
                category: 'Development',
                employer_id: 1,
            },
            {
                id: 2,
                title: 'Node',
                description: 'Expert Node',
                location: 'Ismailia',
                type: 'Full-time',
                category: 'Development',
                employer_id: 2,
            },
            {
                id: 3,
                title: 'React',
                description: 'Expert React',
                location: 'Port Said',
                type: 'Full-time',
                category: 'Development',
                employer_id: 1,
            },
        ]);
        yield knex.raw("select setval('job_id_seq', max(id)) from job");
        //? HERE  APPLICATION
        yield knex('application').insert([
            { id: 1, user_id: 1, job_id: 3, status: 'submitted', cv: 'none', additional_info: 'pew pew' },
            { id: 2, user_id: 2, job_id: 2, status: 'submitted', cv: 'none', additional_info: 'pew pew' },
        ]);
        yield knex.raw("select setval('application_id_seq', max(id)) from application");
    });
}
exports.seed = seed;
