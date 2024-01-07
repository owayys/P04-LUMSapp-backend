import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createCourse, getCourses } from "../controllers/courses.js";

const router = express.Router();

router.post("/create", isAuthenticated, createCourse);
router.get("/get", isAuthenticated, getCourses);

export default router;
