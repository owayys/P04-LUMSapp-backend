import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createComment, getComments, replyComment } from "../controllers/comment.js";

const router = express.Router();

router.post("/create", isAuthenticated, createComment);
router.post("/get", isAuthenticated, getComments);
router.post("/reply", isAuthenticated, replyComment);

export default router;
