"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const swagger_json_1 = __importDefault(require("../swagger.json"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const routes_1 = __importDefault(require("./routes"));
const fileUpload_1 = require("./middlewares/fileUpload");
const payment_1 = require("./controllers/payment");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.post('/webhook', express_1.default.raw({ type: 'application/json' }), payment_1.stripeWebhook);
exports.app.use(express_1.default.json());
exports.app.use((0, helmet_1.default)());
exports.app.use((0, hpp_1.default)());
if (process.env.NODE_ENV !== 'test') {
    exports.app.use((0, morgan_1.default)('dev'));
}
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
exports.app.post('/upload', fileUpload_1.fileUpload, (req, res) => {
    console.log(req.body);
    res.send('passed middleware');
});
exports.app.use(routes_1.default);
exports.app.use(errorHandler_1.default);
