// var pool = require("../db/index");
// const { v4: uuidv4 } = require("uuid");
// const structurePosts = require("../util/structurePosts");
import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Comment } from "../models/comment.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const media = req.files?.media;

    if (!text && !media) {
      return res.status(400).json({
        success: false,
        message: "Please enter text or upload a file",
      });
    }

    const user = User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let mediaUrls = [];
    if (media) {
      for (let i = 0; i < media.length; i++) {
        const result = await cloudinary.v2.uploader.upload(media[i], {
          folder: `LUMSApp/posts/${user._id}`,
        });
        mediaUrls.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      fs.rmSync("./tmp", { recursive: true });
    }

    const post = await Post.create({
      text,
      postedBy: req.user._id,
      media: mediaUrls,
    });

    res.status(200).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    console.log("Error: Unable to create post");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    const { page } = req.body;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(page * 10)
      .limit(10)
      .select("text media likeCount dislikeCount commentCount bookmarkCount")
      .populate("postedBy", "fullname profile_picture");

    // console.log(posts);
    res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      posts,
    });
  } catch (error) {
    console.log("Error: Unable to get feed");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
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

    const index = post.likedBy.indexOf(req.user._id);
    if (index !== -1) {
      post.likedBy.splice(index, 1);
      post.likeCount -= 1;
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Like removed",
      });
    }

    post.likedBy.push(req.user._id);
    post.likeCount += 1;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.log("Error: Unable to like post");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
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

    const index = post.dislikedBy.indexOf(req.user._id);
    if (index !== -1) {
      post.dislikedBy.splice(index, 1);
      post.dislikeCount -= 1;
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Dislike removed",
      });
    }

    post.dislikedBy.push(req.user._id);
    post.dislikeCount += 1;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post disliked",
    });
  } catch (error) {
    console.log("Error: Unable to dislike post");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
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

    // console.log(post.postedBy.toString(), req.user._id.toString());
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    for (let i = 0; i < post.comments.length; i++) {
      await Comment.findByIdAndDelete(post.comments[i]);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log("Error: Unable to delete post");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.postCreate = (req, res) => {
//     var { masterID, parentID, userID, content, timePosted } = req.body;
//     var postID = uuidv4()

//     if (masterID == null) {
//         masterID = postID;
//     }

//     pool.query(`INSERT INTO Post (PostID, MasterID, ParentID, UserID, Content, TimePosted, LastEdited) VALUES ('${postID}','${masterID}',${parentID != null ? `'${parentID}'` : parentID},${userID}, '${content}', '${timePosted}', '${timePosted}')`, (err, result) => {
//         if (err) {
//             if (err.code === 'ER_DUP_ENTRY') {
//                 res.json({ code: err.code })
//             }
//             else {
//                 throw err;
//             }
//         }
//         else {
//             res.json({ code: 200, postID: postID });
//         }
//     });
// }

// exports.postDelete = (req, res) => {
//     const { postID } = req.body;

//     pool.query(`DELETE FROM Post WHERE PostID = '${postID}'`, (err, result) => {
//         if (err) {
//             res.json({ error: err });
//         }
//         else {
//             res.json({ code: 200 });
//         }
//     });
// }

// exports.postGet = (req, res) => {
//     const { postID } = req.body;
//     console.log(postID)
//     pool.query(`SELECT * FROM Post WHERE MasterID = '${postID}'`, (err, results) => {
//         if (err) {
//             res.json({ error: err })
//         } else {
//             var structuredPosts = structurePosts(results)
//             res.json({ code: 200, results: structuredPosts });
//         }
//     });
// }

// exports.postFeed = (req, res) => {
//     const { postLimit } = req.body;
//     pool.query(`SELECT * FROM Post WHERE MasterID = PostID ORDER BY TimePosted DESC LIMIT ${postLimit}`, (err, results) => {
//         if (err) {
//             res.json({ error: err })
//         } else {
//             var structuredPosts = structurePosts(results)
//             res.json({ code: 200, results: structuredPosts });
//         }
//     });
// }
