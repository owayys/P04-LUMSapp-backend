import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getInstructor } from "../controllers/instructor.js";

const router = express.Router();

router.post("/get", isAuthenticated, getInstructor);

export default router;
