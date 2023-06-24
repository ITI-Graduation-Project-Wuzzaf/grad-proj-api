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
const app_1 = require("../../../app");
describe('Auth routes', () => {
    describe('POST /v1/signup', () => {
        it('Should signup new user with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@test.com';
            const res = yield (0, supertest_1.default)(app_1.app)
                .post('/v1/signup')
                .send({
                email,
                password: 'c701b6de',
                confirmPassword: 'c701b6de',
                first_name: 'heya',
                last_name: 'heya',
            })
                .expect(201);
            expect(res.body.user.id).toEqual(6);
            expect(res.body.user.email).toEqual(email);
            expect(res.body.accessToken).toBeDefined();
        }));
        it('Should returns a 422 with an invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/signup')
                .send({
                email: 'test',
                password: 'c701b6de',
                confirmPassword: 'c701b6de',
                first_name: 'heya',
                last_name: 'heya',
            })
                .expect(422);
        }));
        it('Should returns a 422 with an invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/signup')
                .send({
                email: 'test@test.com',
                password: 'pw',
                confirmPassword: 'password',
                first_name: 'heya',
                last_name: 'heya',
            })
                .expect(422);
        }));
        it('Should returns a 422 with missing data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).post('/v1/signup').send().expect(422);
        }));
        it('Should disallow duplicate emails', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@test.com';
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/signup')
                .send({
                email,
                password: 'c701b6de',
                confirmPassword: 'c701b6de',
                first_name: 'heya',
                last_name: 'heya',
            })
                .expect(201);
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/signup')
                .send({
                email,
                password: 'password',
                confirmPassword: 'password',
                first_name: 'heya',
                last_name: 'heya',
            })
                .expect(400);
        }));
    });
    describe('POST /v1/login', () => {
        it('Should return user data and access token when given valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.app)
                .post('/v1/login')
                .send({
                email: 'bassel@test.com',
                password: '12345678',
            })
                .expect(200);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.user.email).toEqual('bassel@test.com');
            expect(res.body.user.first_name).toEqual('Bassel');
            expect(res.body.user.last_name).toEqual('Salah');
        }));
        it("Should fail when an email that doesn't exists is supplied", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/login')
                .send({
                email: 'test@test.com',
                password: '12345678',
            })
                .expect(400);
        }));
        it('Should fail when an incorrect password is supplied', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/login')
                .send({
                email: 'bassel@test.com',
                password: '1234abcd',
            })
                .expect(400);
        }));
        it('Should return 422 when given invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/login')
                .send({
                email: 'bassel',
                password: '12345678',
            })
                .expect(422);
        }));
    });
});
