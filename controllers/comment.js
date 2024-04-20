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
    const { postId, commentId, text } = req.body;
  



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

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

   
    post.commentCount += 1;
    await post.save();

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
    const { postId,_id } = req.body;
    const userId = req.user._id;
    // console.log(userId,postId)

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const post = await Post.findById(postId).populate({
        path: "comments",
        populate: {
          path: "postedBy",
          select: "fullname profile_picture",
        },
      });
     

      const a = post.comments.map(comment => {
        const isLikedByUser = comment.likedBy.includes(userId);
        const isDislikedByUser = comment.dislikedBy.includes(userId);

        // console.log(comment.toObject())
        // const rest = comment.toObject();
        const { ...rest } = comment;
        const cc = { ...rest._doc, isLikedByUser, isDislikedByUser };
        // console.log(cc)
        return cc;
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
      comments: a,
      userId:userId
    });
  } catch (error) {
    console.log("Error: Unable to fetch comments");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const voteComment = async (req, res) => {
// console.log("");

  try {
    const {commentId,voteType}  = req.body;
    console.log(commentId,voteType);

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment does not exist",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

  // up , down,del_up,del_down

  if (voteType == "up") {
    if (comment.likedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this comment",
      });
    }
    if (comment.dislikedBy.includes(req.user._id)) {
      comment.dislikedBy.pull(req.user._id);
      comment.dislikeCount -= 1;
    }
    comment.likedBy.push(req.user._id);
    comment.likeCount += 1;
  }
  else if (voteType == "down") {
    if (comment.dislikedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already disliked this comment",
      });
    }
    if (comment.likedBy.includes(req.user._id)) {
      comment.likedBy.pull(req.user._id);
      comment.likeCount -= 1;
    }
    comment.dislikedBy.push(req.user._id);
    comment.dislikeCount += 1;
  }
  else if (voteType == "del_up") {
    if (!comment.likedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this comment",
      });
    }
    comment.likedBy.pull(req.user._id);
    comment.likeCount -= 1;
  }
  else if (voteType == "del_down") {
    if (!comment.dislikedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have not disliked this comment",
      });
    }
    comment.dislikedBy.pull(req.user._id);
    comment.dislikeCount -= 1;
  }
  else {
    return res.status(400).json({
      success: false,
      message: "Invalid vote type",
    });
  }


 
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Vote updated"
    });
  } catch (error) {
    console.log(`Error: Unable to vote comment`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const getReplies = async (req, res) => {



  try {
    const { commentId } = req.body;
    const userId = req.user._id;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const comment = await Comment.findById(commentId).
    populate({
      path: "replies",
      populate: {
        path: "postedBy",
        select: "fullname profile_picture",
      },
    });

    const a = comment.replies.map(comment => {
      const isLikedByUser = comment.likedBy.includes(userId);
      const isDislikedByUser = comment.dislikedBy.includes(userId);

      // console.log(comment.toObject())
      // const rest = comment.toObject();
      const { ...rest } = comment;
      const cc = { ...rest._doc, isLikedByUser, isDislikedByUser };
      // console.log(cc)
      return cc;
    });



    // console.log(a)

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Replies fetched",
      replies: a,
    });

  }
  catch (error) {
    console.log("Error: Unable to fetch replies");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;

   
    

    if (!commentId) {
      console.log("Please enter all the fields");
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.log("Comment does not exist");
      return res.status(400).json({
        success: false,
        message: "Comment does not exist",
      });
    }

    if (comment.postedBy._id.toString() !== req.user._id.toString()) {
      console.log("You are not authorized to delete this comment");
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    const result = await comment.deleteOne({ _id: commentId });

    const lengthReplies = comment.replies.length;

    // Remove any references to this comment from other documents
  const resp = await Comment.updateMany(
      { replies: commentId },
      { $pull: { replies: commentId } }
    );

 
  

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }



    post.commentCount -= 1 + lengthReplies;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.log("Error: Unable to delete comment", error);
    return res.status(500).json({
      success: false,
      message: "Error: Unable to delete comment",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;

    if (!commentId || !text) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment does not exist",
      });
    }

    if (comment.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }

    comment.text = text;
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated",
    });
  } catch (error) {
    console.log("Error: Unable to update comment");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
