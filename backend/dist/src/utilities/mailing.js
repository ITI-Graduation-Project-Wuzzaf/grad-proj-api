"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
const mails_1 = require("./mail-templates/mails");
dotenv_1.default.config();
const { MAILING_USER, MAILING_PW, FROM_EMAIL } = process.env;
// NOTE  remember to pass options to the function for email and content
const mail = (reciever, subject, sender, name, msg) => {
    // HERE  create SMTP service to be able to send mails
    const transporter = (0, nodemailer_1.createTransport)({
        service: 'hotmail',
        auth: {
            user: MAILING_USER,
            pass: MAILING_PW,
        },
    });
    const message = {
        from: `Jobify <${FROM_EMAIL}>`,
        to: reciever,
        subject: subject,
        text: 'For clients with plaintext support only',
        html: sender ? (0, mails_1.contactTemplate)(sender, name, msg) : (0, mails_1.paymentTemplate)(),
    };
    transporter.sendMail(message, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('mail sent');
        }
    });
};
exports.default = mail;
