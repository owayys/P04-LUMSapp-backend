import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getDonations, createDonations, getSpecificDonation, updateDonation} from "../controllers/donations.js";

const router = express.Router();

router.post("/get", isAuthenticated, getDonations);
router.post("/create", isAuthenticated, createDonations);
router.post("/getSpecificDonation", isAuthenticated, getSpecificDonation);
router.post("/update", isAuthenticated, updateDonation);

export default router;
