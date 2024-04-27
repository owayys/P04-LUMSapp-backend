import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getDonations, createDonations, getSpecificDonation, updateDonation, deleteSpecificDonation} from "../controllers/donations.js";

const router = express.Router();

router.post("/get", isAuthenticated, getDonations);
router.post("/create", isAuthenticated, createDonations);
router.post("/getSpecificDonation", isAuthenticated, getSpecificDonation);
router.post("/update", isAuthenticated, updateDonation);
router.post("/deleteSpecificDonation", isAuthenticated, deleteSpecificDonation);

export default router;
