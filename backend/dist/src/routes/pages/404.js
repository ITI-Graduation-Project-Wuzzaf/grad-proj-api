"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notFoundError_1 = require("../../errors/notFoundError");
const router = (0, express_1.Router)();
router.all('*', (_req, _res) => {
    throw new notFoundError_1.NotFoundError();
});
exports.default = router;
