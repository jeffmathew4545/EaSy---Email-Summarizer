import {Router} from "express";
import {summarizeEmail} from "../contollers/summary.controller";

const router = Router();

router.post("/summarize", summarizeEmail);

export default router;