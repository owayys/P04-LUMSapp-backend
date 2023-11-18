import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [100, "Your name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  profile_picture: {
    public_id: String,
    url: String,
  },
  bio: {
    type: String,
    maxLength: [225, "Your bio cannot exceed 225 characters"],
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  bookmarks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
  ],

  otp: String,
  otpExpire: Date,

  resetPasswordOtp: String,
  resetPasswordOtpExpire: Date,
});

userSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000,
  });
};

userSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
