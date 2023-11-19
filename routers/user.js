import {
  userSignup,
  userVerify,
  logout,
  userLogin,
  bookmarkPost,
} from "../controllers/user.js";
import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
router.post("/signup", userSignup);
router.post("/verify", isAuthenticated, userVerify);
router.post("/login", userLogin);
router.get("/logout", isAuthenticated, logout);
router.post("/bookmark", isAuthenticated, bookmarkPost);

export default router;
