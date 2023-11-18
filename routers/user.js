// import { userSignup, userLogin } from "../controllers/user";

import express from "express";

const router = express.Router();
// router.post("/signup", userSignup);
// router.post("/login", userLogin);
router.get("/get", (req, res) => {
  res.send("GET");
});

export default router;
