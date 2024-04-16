import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getDonations } from "../controllers/donations.js";

const router = express.Router();

router.post("/get", isAuthenticated, getDonations);

export default router;
