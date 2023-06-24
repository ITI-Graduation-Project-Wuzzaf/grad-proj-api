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
describe('Profile routes', () => {
    describe('GET /v1/profiles/:id', () => {
        it('Should retrive user profile', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/profiles/1').set('Authorization', `Bearer ${token}`).expect(200);
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).get('/v1/profiles/1').expect(401);
        }));
        it("Should return 404 when given user id that doesn't exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app).get('/v1/profiles/0951').set('Authorization', `Bearer ${token}`).expect(404);
        }));
    });
    describe('PATCH /v1/profiles', () => {
        it('Should update user profile when giving valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            const res = yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/profiles')
                .field('city', 'Port Said')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.city).toEqual('Port Said');
        }));
        it('Should return 401 if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).patch('/v1/profiles').expect(401);
        }));
        it('Should return 422 when given no parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield global.signin('bassel@test.com');
            yield (0, supertest_1.default)(app_1.app)
                .patch('/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .expect(422);
        }));
    });
});
