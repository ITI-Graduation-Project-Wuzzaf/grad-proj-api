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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.checkout = void 0;
const BadRequestError_1 = require("../errors/BadRequestError");
const crud_1 = require("../utilities/crud");
const stripe_1 = require("../utilities/stripe");
const mailing_1 = __importDefault(require("../utilities/mailing"));
const notifications = __importStar(require("../utilities/notifications"));
const crud = __importStar(require("../utilities/crud"));
const index_1 = require("../index");
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield stripe_1.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        mode: 'payment',
        metadata: {
            jobId: req.body.jobId,
            userId: res.locals.userId,
        },
        line_items: [
            {
                price: 'price_1NCpCuEQc4Ij7mVsLbyYSyzo',
                quantity: 1,
            },
        ],
        success_url: 'http://localhost:5173/',
        cancel_url: 'http://localhost:5173/?payment=failed',
    });
    res.send({ sessionId: session.id });
});
exports.checkout = checkout;
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    const endPointSecret = process.env.STRIPE_WH + '';
    if (!sig) {
        throw new BadRequestError_1.BadRequestError('Cannot proceed without signature');
    }
    let stripeEvent;
    try {
        stripeEvent = stripe_1.stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
    }
    catch (err) {
        throw new BadRequestError_1.BadRequestError('An error occured while verifying the signature.');
    }
    switch (stripeEvent.type) {
        case 'checkout.session.completed':
            if (stripeEvent.data.object.metadata && stripeEvent.data.object.customer_details) {
                const jobId = stripeEvent.data.object.metadata.jobId;
                yield (0, crud_1.update)('job', jobId, { featured: true });
                const userId = stripeEvent.data.object.metadata.userId;
                const url = `/jobDetails/${jobId}`;
                const content = 'Featured Job Payment Confirmation';
                const data = { content, url, recipient_id: userId, recipient_type: 'employer' };
                const notification = yield notifications.create(data);
                yield crud.update('employer', userId, { featured: true });
                index_1.io.to(`employer_${userId}`).emit('notification', notification);
                (0, mailing_1.default)(stripeEvent.data.object.customer_details.email, 'Featured Job Payment Confirmation');
            }
            break;
        default:
            throw new BadRequestError_1.BadRequestError(`Unkown stripe event ${stripeEvent.type}}`);
    }
    res.send({});
});
exports.stripeWebhook = stripeWebhook;
