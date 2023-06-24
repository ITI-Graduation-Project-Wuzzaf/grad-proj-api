"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send(`<h2>Welcome to our app jobify</h2>
  <p>To see all available endpoints: </p>
  <a href="/api-docs">Here</a>`);
});
exports.default = router;
