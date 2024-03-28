import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createEvent, getEvents, deleteEvent } from "../controllers/event.js";

const router = express.Router();

router.post("/create", isAuthenticated, createEvent);
router.post("/get", isAuthenticated, getEvents);
router.post("/delete", isAuthenticated, deleteEvent);

export default router;
