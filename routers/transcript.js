import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { transcriptParser } from "../controllers/transcript.js";

const router = express.Router();

router.post("/parse", isAuthenticated, transcriptParser);

export default router;
