import {Request, Response} from "express";
import {generateSummary} from "../services/ai.service";

export const summarizeEmail = async (
    req: Request,
    res: Response
) => {
    try {
        const {subject, sender, body} = req.body;

        if (!body) {
            return res.status(400).json({
                success: false,
                message: "Email body is required"
            })
        }

        const summary = await generateSummary({
            subject,
            sender,
            body
        });

        return res.json({
            success: true,
            summary
        });

    } catch (error) {
        console.error("Summarization error:", error);
        return res.status(500).json({
            success:false,
            message: "Failed to summarize the email."
        });
    }
}