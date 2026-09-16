"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeEmail = void 0;
const ai_service_1 = require("../services/ai.service");
const summarizeEmail = async (req, res) => {
    try {
        const { subject, sender, body } = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                message: "Email body is required"
            });
        }
        const summary = await (0, ai_service_1.generateSummary)({
            subject,
            sender,
            body
        });
        return res.json({
            success: true,
            summary
        });
    }
    catch (error) {
        console.error("Summarization error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to summarize the email."
        });
    }
};
exports.summarizeEmail = summarizeEmail;
