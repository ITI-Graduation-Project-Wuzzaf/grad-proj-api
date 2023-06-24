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
exports.pagination = exports.update = exports.create = exports.index = exports.unRead = void 0;
const knex_1 = __importDefault(require("../../db/knex"));
const unRead = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { recipient_id: id, recipient_type: role, is_read: false };
    const unreadCount = +(yield (0, knex_1.default)('notification').where(where).count('id'))[0].count;
    return unreadCount;
});
exports.unRead = unRead;
const index = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { recipient_id: id, recipient_type: role };
    const notifications = yield (0, knex_1.default)('notification').where(where).limit(6).orderBy('id', 'desc');
    return notifications;
});
exports.index = index;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield (0, knex_1.default)('notification').insert(data).returning('*');
    return notification[0];
});
exports.create = create;
const update = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { recipient_id: id, recipient_type: role, is_read: false };
    yield (0, knex_1.default)('notification').where(where).update({ is_read: true });
});
exports.update = update;
const pagination = (id, role, page) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { recipient_id: id, recipient_type: role };
    const query = (0, knex_1.default)('notification').where(where);
    const query2 = query.clone();
    const perPage = 12;
    const skip = (page - 1) * perPage;
    const total = +(yield query.count('id'))[0].count;
    const numberOfPages = Math.ceil(total / perPage);
    const next = page * perPage < total ? true : false;
    const prev = page > 1 ? true : false;
    const notifications = yield query2.select('*').limit(12).offset(skip).orderBy('id', 'desc');
    return { pagination: { page, next, prev, numberOfPages, total }, notifications };
});
exports.pagination = pagination;
