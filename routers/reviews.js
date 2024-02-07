import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createReview } from "../controllers/reviews.js";

const router = express.Router();

router.post("/create", isAuthenticated, createReview);

export default router;
