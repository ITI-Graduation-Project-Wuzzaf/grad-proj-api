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
const supertest_1 = __importDefault(require("supertest"));
const knex_1 = __importDefault(require("../../db/knex"));
const app_1 = require("../app");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield knex_1.default.migrate.rollback();
    yield knex_1.default.migrate.latest();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield knex_1.default.raw('TRUNCATE TABLE application RESTART IDENTITY CASCADE');
    yield knex_1.default.raw('TRUNCATE TABLE profile RESTART IDENTITY CASCADE');
    yield knex_1.default.raw('TRUNCATE TABLE job RESTART IDENTITY CASCADE');
    yield knex_1.default.raw('TRUNCATE TABLE user_account RESTART IDENTITY CASCADE');
    yield knex_1.default.raw('TRUNCATE TABLE employer RESTART IDENTITY CASCADE');
    yield knex_1.default.seed.run();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // await knex.migrate.rollback();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield knex_1.default.migrate.rollback();
    yield knex_1.default.destroy();
}));
global.signin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, supertest_1.default)(app_1.app).post('/v1/login').send({
        email,
        password: '12345678',
    });
    const token = res.body.accessToken;
    return token;
});
