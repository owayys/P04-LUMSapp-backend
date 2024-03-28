import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createLocation, getLocations } from "../controllers/location.js";

const router = express.Router();

router.post("/create", isAuthenticated, createLocation);
router.get("/get", isAuthenticated, getLocations);

export default router;
