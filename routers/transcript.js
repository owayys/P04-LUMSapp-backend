import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { parseTranscript } from "../controllers/transcript.js";

const router = express.Router();

router.post("/parse", isAuthenticated, parseTranscript);

export default router;
