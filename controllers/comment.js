import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Comment } from "../models/comment.js";

export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const comment = await Comment.create({
      text,
      postedBy: req.user._id,
    });

    post.comments.push(comment._id);
    post.commentCount += 1;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment created",
      comment,
    });
  } catch (error) {
    console.log("Error: Unable to create comment");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;

    if (!commentId || !text) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment does not exist",
      });
    }


    const reply = await Comment.create({
      text,
      postedBy: req.user._id,
      level: comment.level + 1,
    });

    comment.replies.push(reply._id);
    comment.commentCount += 1;
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment created",
      reply,
      commentId: reply._id, // Include the comment ID in the response
    });
  } catch (error) {
    console.log("Error: Unable to create comment");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}




export const getComments = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const post = await Post.findById(postId)
      .populate("comments", "text postedBy createdAt likesCount dislikeCount replies")
      .populate({
        path: "comments",
        populate: {
          path: "postedBy",
          select: "fullname profile_picture",
        },
      });
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comments fetched",
      comments: post.comments,
    });
  } catch (error) {
    console.log("Error: Unable to fetch comments");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
