import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please enter post text"],
    maxLength: [4000, "Post text cannot exceed 2000 characters"],
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
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  media: [
    {
      public_id: String,
      url: String,
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

export const Post = mongoose.model("Post", postSchema);
