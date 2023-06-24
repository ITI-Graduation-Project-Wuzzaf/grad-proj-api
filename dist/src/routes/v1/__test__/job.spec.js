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
describe('Job routes', () => {
    describe('GET /v1/jobs', () => {
        it('Should retrive paginated jobs and pagination info', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.app).get('/v1/jobs').expect(200);
            expect(res.body.pagination).toBeDefined();
            expect(Array.isArray(res.body.jobs)).toBe(true);
        }));
    });
    describe('POST /v1/jobs', () => {
        it('Should post a job when given valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            const title = 'React developer';
            const res = yield (0, supertest_1.default)(app_1.app)
                .post('/v1/jobs')
                .send({
                title,
                description: 'We need an experienced react developer asap',
                type: 'Full-time',
                location: 'Remote',
                category: 'Development',
            })
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.title).toEqual(title);
            expect(res.body.location).toEqual('Remote');
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            const title = 'React developer';
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/jobs')
                .send({
                title,
            })
                .expect(401);
        }));
        it('Should return 401 if user is not an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            const title = 'React developer';
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/jobs')
                .send({
                title,
            })
                .set('Authorization', `Bearer ${token}`)
                .expect(401);
        }));
        it('Should return 422 with missing data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            const title = 'React developer';
            yield (0, supertest_1.default)(app_1.app)
                .post('/v1/jobs')
                .send({
                title,
            })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
        }));
    });
    describe('GET /v1/jobs/:id', () => {
        it('Should retrive job data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).get('/v1/jobs/1').expect(200);
        }));
        it("Should return 404 when job isn't found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).get('/v1/jobs/0951').expect(404);
        }));
    });
    describe('PATCH /v1/jobs/:id', () => {
        it('Should update job data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            const res = yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/jobs/1')
                .send({ title: 'Cloud Architect' })
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.title).toEqual('Cloud Architect');
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).patch('/v1/jobs/1').expect(401);
        }));
        it('Should return 401 if user is not an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).patch('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(401);
        }));
        it('Should return 404 if user is trying to update others job posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/jobs/2')
                .send({ title: 'Cloud Architect' })
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        }));
        it("Should return 404 when job isn't found", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/jobs/0951')
                .send({ title: 'Cloud Architect' })
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        }));
        it('Should return 422 when given no parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).patch('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(422);
        }));
    });
    describe('DELETE /v1/jobs/:id', () => {
        it('Should delete a job post', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).delete('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(200);
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete('/v1/jobs/1').expect(401);
        }));
        it('Should return 401 if user is not an employer', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).delete('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(401);
        }));
        it('Should return 404 if user is trying to delete others job posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).delete('/v1/jobs/2').set('Authorization', `Bearer ${token}`).expect(404);
        }));
        it("Should return 404 when job isn't found", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('jobify@company.com');
            yield (0, supertest_1.default)(app_1.app).delete('/v1/jobs/0951').set('Authorization', `Bearer ${token}`).expect(404);
        }));
    });
});
