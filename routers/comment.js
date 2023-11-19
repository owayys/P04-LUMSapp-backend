import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createComment } from "../controllers/comment.js";

const router = express.Router();

router.post("/create", isAuthenticated, createComment);

export default router;
