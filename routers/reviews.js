import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createReview, deleteReview, editReview } from "../controllers/reviews.js";

const router = express.Router();

router.post("/create", isAuthenticated, createReview);
router.post("/delete", isAuthenticated, deleteReview);
router.post("/edit", isAuthenticated, editReview);


export default router;
