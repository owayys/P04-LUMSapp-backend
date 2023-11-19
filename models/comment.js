import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please enter comment text"],
    maxLength: [2000, "Comment text cannot exceed 2000 characters"],
  },
  likedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  dislikedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
