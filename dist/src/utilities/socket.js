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
exports.socketIO = void 0;
const socket_io_1 = require("socket.io");
const notifications = __importStar(require("./notifications"));
const socket_1 = require("./validation/socket");
const socketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => {
        socket.on('add-user', ({ id, role }) => __awaiter(void 0, void 0, void 0, function* () {
            const { error } = socket_1.socketSchema.validate({ id, role });
            if (error)
                return;
            const room = `${role}_${id}`;
            socket.join(room);
            // io.to(room) to even include the sender
            socket.emit('unread-notifications', yield notifications.unRead(id, role));
            socket.on('disconnect', () => {
                var _a;
                if (((_a = io.sockets.adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size) === 0) {
                    io.sockets.adapter.rooms.delete(room);
                }
            });
        }));
        socket.on('read-notifications', ({ id, role }) => __awaiter(void 0, void 0, void 0, function* () {
            const { error } = socket_1.socketSchema.validate({ id, role });
            if (error)
                return;
            const room = `${role}_${id}`;
            socket.emit('read-notifications', yield notifications.index(id, role));
            yield notifications.update(id, role);
            socket.to(room).emit('unread-notifications', 0);
        }));
        socket.on('notification', ({ id, role, jobId, jobName, appId }) => __awaiter(void 0, void 0, void 0, function* () {
            const { error } = socket_1.notifSchema.validate({ id, role, jobId, jobName, appId });
            if (error)
                return;
            const room = `${role}_${id}`;
            const url = `/jobs/${jobId}/applications/${appId}`;
            const content = role === 'employer'
                ? `A new candidate has applied for ${jobName}, Don't miss out.`
                : `A response has been sent by the recruiter of ${jobName}.`;
            const data = { content, url, recipient_id: id, recipient_type: role };
            const notification = yield notifications.create(data);
            io.to(room).emit('notification', notification);
        }));
    });
    if (process.env.NODE_ENV === 'test') {
        io.close();
    }
    return io;
};
exports.socketIO = socketIO;
