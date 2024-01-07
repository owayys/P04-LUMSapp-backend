import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

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
    autopopulate: {
      select: "fullname profile_picture",
    },
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
  level: {
    type: Number,
    default: 0,
  },

  replies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      autopopulate: true,
    },
  ],

  level: {
    type: Number,
    default: 0,
  },
});


// commentSchema.plugin(require("mongoose-autopopulate"));

// export const Comment = mongoose.model("Comment", commentSchema);
commentSchema.plugin(autopopulate);

export const Comment = mongoose.model("Comment", commentSchema);
