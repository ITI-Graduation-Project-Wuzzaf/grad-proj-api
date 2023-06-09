"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkRole_1 = require("./../../middlewares/checkRole");
const express_1 = require("express");
const auth_1 = require("./auth");
const profile_1 = require("./profile");
const employer_1 = require("./employer");
const job_1 = require("./job");
const application_1 = require("./application");
const user_1 = require("./user");
const search_1 = require("./search");
const payment_1 = require("./payment");
const requireAuth_1 = require("../../middlewares/requireAuth");
const currentUser_1 = require("../../middlewares/currentUser");
const admin_1 = require("./admin");
const router = (0, express_1.Router)();
router.use(auth_1.authRouter);
router.use(profile_1.profileRouter);
router.use(employer_1.employerRouter);
router.use(job_1.jobRouter);
router.use(search_1.searchRouter);
router.use(user_1.userRouter);
router.use(currentUser_1.currentUser, requireAuth_1.requireAuth, application_1.applicationRouter);
router.use(payment_1.paymentRouter);
router.use((0, checkRole_1.checkRole)('admin'), admin_1.adminRouter);
exports.default = router;
