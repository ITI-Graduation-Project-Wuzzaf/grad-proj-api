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
exports.io = exports.server = void 0;
const http_1 = require("http");
const app_1 = require("./app");
const socket_1 = require("./utilities/socket");
exports.server = (0, http_1.createServer)(app_1.app);
const PORT = process.env.PORT || 5000;
exports.io = (0, socket_1.socketIO)(exports.server);
exports.server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`server is running on localhost:${PORT}`);
}));
