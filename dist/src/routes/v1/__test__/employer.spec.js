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
describe('Employer routes', () => {
    describe('POST /v1/employers', () => {
        it('Should signup new employer with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'test@company.com';
            const res = yield (0, supertest_1.default)(app_1.app)
                .post('/v1/employers')
                .send({
                email,
                password: 'c701b6de',
                confirmPassword: 'c701b6de',
                name: 'company',
            })
                .expect(201);
            expect(res.body.employer.id).toEqual(3);
            expect(res.body.employer.email).toEqual(email);
            expect(res.body.accessToken).toBeDefined();
        }));
        it('Should returns a 422 with an invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/employers')
                .send({
                email: 'test',
                password: 'password',
                confirmPassword: 'password',
                name: 'company',
            })
                .expect(422);
        }));
        it('Should returns a 422 with an invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/employers')
                .send({
                email: 'test@company.com',
                password: 'pw',
                confirmPassword: 'password',
                name: 'company',
            })
                .expect(422);
        }));
        it('Should disallow duplicate emails', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/employers')
                .send({
                email: 'jobify@company.com',
                password: 'password',
                confirmPassword: 'password',
                name: 'company',
            })
                .expect(400);
        }));
    });
    describe('GET /v1/employers/:id', () => {
        it('Should retrive user profile', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/employers/1').set('Authorization', `Bearer ${token}`).expect(200);
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).get('/v1/employers/1').expect(401);
        }));
        it("Should return 404 when given user id that doesn't exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/employers/0951').set('Authorization', `Bearer ${token}`).expect(404);
        }));
    });
    describe('PATCH /v1/employers', () => {
        it('Should update employer data with valid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            const res = yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/employers')
                .field('country', 'Egypt')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.country).toEqual('Egypt');
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).patch('/v1/employers').expect(401);
        }));
        it('Should return 422 when given no parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/employers')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .expect(422);
        }));
    });
});
