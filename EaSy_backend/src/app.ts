import express from "express";
import cors from "cors";
import summaryRoutes from "./routes/summary.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Email Summarizer API is running"
    });
});

app.use("/api", summaryRoutes);

export default app;