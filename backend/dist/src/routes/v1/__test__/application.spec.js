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
describe('Application routes', () => {
    describe('GET /v1/jobs/:id/applications', () => {
        it('Should return applications of a job when requested by employer who posted the job', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            const res = yield (0, supertest_1.default)(app_1.app).get('/v1/jobs/3/applications').set('Authorization', `Bearer ${token}`).expect(200);
            expect(res.body.pagination).toBeDefined();
            expect(Array.isArray(res.body.applications)).toBe(true);
        }));
        it('Should respond with 401 if user is not logged in or not an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/jobs/3/applications').expect(401);
            yield (0, supertest_1.default)(app_1.app).get('/v1/jobs/3/applications').set('Authorization', `Bearer ${token}`).expect(401);
        }));
        it('Should return 401 if employer is not the job poster', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/jobs/2/applications').set('Authorization', `Bearer ${token}`).expect(401);
        }));
    });
    describe('GET /v1/users/applications', () => {
        it('Should all applications submitted by current user', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            const res = yield (0, supertest_1.default)(app_1.app).get('/v1/users/applications').set('Authorization', `Bearer ${token}`).expect(200);
            expect(res.body.pagination).toBeDefined();
            expect(Array.isArray(res.body.applications)).toBe(true);
        }));
        it('Should respond with 401 if not logged in or an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/users/applications').expect(401);
            yield (0, supertest_1.default)(app_1.app).get('/v1/users/applications').set('Authorization', `Bearer ${token}`).expect(401);
        }));
    });
    describe('GET /v1/applications/:id', () => {
        it('Should return application info, when requested by the applicatnt or job employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            const res = yield (0, supertest_1.default)(app_1.app).get('/v1/applications/1').set('Authorization', `Bearer ${token}`).expect(200);
            expect(res.body.status).toEqual('submitted');
            const employerToken = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/applications/1').set('Authorization', `Bearer ${employerToken}`).expect(200);
        }));
        it('Should respond with 401 if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).get('/v1/applications/2').expect(401);
        }));
        it('Should respond with 404 if user is not the applicant or the job employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/applications/2').set('Authorization', `Bearer ${token}`).expect(404);
            const employerToken = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/applications/2').set('Authorization', `Bearer ${employerToken}`).expect(404);
        }));
        it('Should return 404 if application is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/applications/19').set('Authorization', `Bearer ${token}`).expect(404);
        }));
    });
    describe('POST /v1/applications', () => {
        it('Should submit application when given valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            const res = yield (0, supertest_1.default)(app_1.app)
                .post('/v1/applications')
                .field('job_id', '1')
                .field('cv', 'Bonzo wonzo cv')
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.status).toEqual('submitted');
        }));
        it('Should respond with 400 when user try to apply for the same job more than once', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/applications')
                .send({ job_id: 3, cv: 'Bonzo cv' })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
        }));
        it('Should respond with 401 if not logged in or an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).post('/v1/applications').expect(401);
            yield (0, supertest_1.default)(app_1.app).post('/v1/applications').set('Authorization', `Bearer ${token}`).expect(401);
        }));
        it("Should responds with 404, if the job user applying for doesn't exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/applications')
                .field('job_id', '4')
                .field('cv', 'Bonzo wonzo cv')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        }));
        it('Should return 422, when data is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/applications')
                .field('job_id', '4')
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
        }));
    });
    describe('PATCH /v1/applications/:id', () => {
        it('Should submit application when given valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            const cv = 'Bonzo wonzo edited';
            const res = yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/applications/1')
                .field('cv', cv)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.cv).toEqual(cv);
        }));
        it('Should respond with 401 if not logged in or an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).patch('/v1/applications/1').expect(401);
            yield (0, supertest_1.default)(app_1.app).patch('/v1/applications/1').set('Authorization', `Bearer ${token}`).expect(401);
        }));
        it('Should return 404 if application is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/applications/920')
                .field('cv', 'update')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        }));
        it('Should return 404 if user is not application owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/applications/2')
                .field('cv', 'update')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        }));
        it('Should return 422, when given invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/applications/1')
                .field('job_id', 1)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
        }));
    });
});
