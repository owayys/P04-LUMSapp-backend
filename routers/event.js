import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  createEvent,
  getEvents,
  deleteEvent,
  mostRecentEvent,
} from "../controllers/event.js";

const router = express.Router();

router.post("/create", isAuthenticated, createEvent);
router.post("/get", isAuthenticated, getEvents);
router.post("/delete", isAuthenticated, deleteEvent);
router.get("/recent", isAuthenticated, mostRecentEvent);

export default router;
