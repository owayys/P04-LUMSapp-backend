import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please login to continue",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    console.log("Error: Could not authenticate user");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
