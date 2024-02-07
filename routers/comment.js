import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createComment, deleteComment, getComments, getReplies, replyComment, updateComment, voteComment } from "../controllers/comment.js";

const router = express.Router();

router.post("/create", isAuthenticated, createComment);
router.post("/get", isAuthenticated, getComments);
router.post("/reply", isAuthenticated, replyComment);
router.post("/vote", isAuthenticated, voteComment);
router.post("/replies", isAuthenticated, getReplies);
router.post("/delete",isAuthenticated, deleteComment);
router.post("/update",isAuthenticated, updateComment);

export default router;
