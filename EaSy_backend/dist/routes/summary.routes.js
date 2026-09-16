"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const summary_controller_1 = require("../contollers/summary.controller");
const router = (0, express_1.Router)();
router.post("/summarize", summary_controller_1.summarizeEmail);
exports.default = router;
