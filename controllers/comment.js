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
