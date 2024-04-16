import express from "express";
import {
    registerPushToken,
    getUserNotifs,
} from "../controllers/notification.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", isAuthenticated, registerPushToken);
router.post("/get", isAuthenticated, getUserNotifs);

export default router;
