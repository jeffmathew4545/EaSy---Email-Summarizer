import Groq from "groq-sdk";

interface EmailData {
    subject?: string;
    sender?: string;
    body: string;
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const generateSummary = async (
    email: EmailData
): Promise<string> => {

    const prompt = `
    You are an email summarization assistant.
    Summarize the following email clearly and concisely.
    Email subject:
    ${email.subject || "No subject"}
    Sender:
    ${email.sender || "Unknown"}
    Email body:
    ${email.body}
    
    Provide:
    1. A short summary
    2. The key points
    3. Any important actions, items or deadlines
    
    Do not invent information that is not present in the email.
    `;

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content: "You are a helpful email summarization assistant."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.choices[0]?.message?.content || "";
};