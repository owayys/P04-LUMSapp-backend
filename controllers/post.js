import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Comment } from "../models/comment.js";
import { Notification } from "../models/notification.js";
import { sendNotification } from "../services/FirebaseService.js";
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        const media = req.files ? Object.values(req.files) : [];

        if (!text && media.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter text or upload a file",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        let mediaUrls = [];
        if (media.length > 0) {
            // Upload each file to Cloudinary and store the URLs
            const uploadPromises = media.map((file) =>
                cloudinary.v2.uploader.upload(file.tempFilePath, {
                    resource_type: "auto", // 'auto' allows Cloudinary to detect the file type
                })
            );

            // Await all the Cloudinary upload promises
            const uploadResults = await Promise.all(uploadPromises);
            // Extract the URLs and other desired data
            mediaUrls = uploadResults.map((result) => ({
                url: result.secure_url,
                public_id: result.public_id,
            }));
        }

        // Create the post with the text and media URLs
        const post = await Post.create({
            text,
            postedBy: req.user._id,
            media: mediaUrls,
        });

        res.status(200).json({
            success: true,
            message: "Post created successfully",
            post, // return the created post as well
        });
    } catch (error) {
        console.log("Error: Unable to create post", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFeed = async (req, res) => {
    try {
        const { page } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        let posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(page * 10)
            .limit(10)
            .select(
                "text media likeCount dislikeCount commentCount bookmarkCount likedBy dislikedBy"
            )
            .populate("postedBy", "fullname profile_picture");

        const postWithLikedDislikedInfo = posts.map((post) => {
            const isLikedbyUser = post.likedBy.includes(req.user.id);
            const isDislikedbyUser = post.dislikedBy.includes(req.user.id);

            const { likedBy, dislikedBy, ...postWithoutLikedByDislikedBy } =
                post;
            return {
                ...postWithoutLikedByDislikedBy._doc,
                isLikedbyUser,
                isDislikedbyUser,
            };
        });
        posts = postWithLikedDislikedInfo;
        // console.log(posts);

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

export const getUserPosts = async (req, res) => {
    try {
        const { page } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        let posts = await Post.find({ postedBy: user })
            .sort({ createdAt: -1 })
            .skip(page * 10)
            .limit(10)
            .select(
                "text media likeCount dislikeCount commentCount bookmarkCount likedBy dislikedBy"
            )
            .populate("postedBy", "fullname profile_picture");

        const postWithLikedDislikedInfo = posts.map((post) => {
            const isLikedbyUser = post.likedBy.includes(req.user.id);
            const isDislikedbyUser = post.dislikedBy.includes(req.user.id);

            const { likedBy, dislikedBy, ...postWithoutLikedByDislikedBy } =
                post;
            return {
                ...postWithoutLikedByDislikedBy._doc,
                isLikedbyUser,
                isDislikedbyUser,
            };
        });
        posts = postWithLikedDislikedInfo;

        res.status(200).json({
            success: true,
            message: "User posts fetched successfully",
            posts,
        });
    } catch (error) {
        console.log("Error: Unable to get user posts");
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

            await Notification.deleteMany({
                actor: req.user._id,
                recipient: post.postedBy._id,
                entity: post._id,
                type: "like",
                onModel: "Post",
            });

            return res.status(200).json({
                success: true,
                message: "Like removed",
            });
        }

        post.likedBy.push(req.user._id);
        post.likeCount += 1;
        await post.save();

        if (req.user._id !== post.postedBy._id) {
            await Notification.create({
                actor: req.user._id,
                recipient: post.postedBy._id,
                entity: post._id,
                type: "like",
                onModel: "Post",
            });

            sendNotification(post.postedBy._id, {
                title: req.user.fullname + " liked your post",
                body: post.text,
            });
        }

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

            await Notification.deleteMany({
                actor: req.user._id,
                recipient: post.postedBy._id,
                entity: post._id,
                type: "like",
                onModel: "Post",
            });

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
            return res.status(200).json({
                success: false,
                message: "Please enter all the fields",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "Could not authenticate user",
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(200).json({
                success: false,
                message: "Post does not exist",
            });
        }

        // console.log(post.postedBy.toString(), req.user._id.toString());
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(200).json({
                success: false,
                message: "You are not authorized to delete this post",
            });
        }

        for (let i = 0; i < post.comments.length; i++) {
            await Comment.findByIdAndDelete(post.comments[i]);
        }

        await Post.findByIdAndDelete(postId);

        await Notification.deleteMany({
            entity: post._id,
        });

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

export const editPost = async (req, res) => {
    try {
        const { postId, text } = req.body;
        if (!postId || !text) {
            return res.status(200).json({
                success: false,
                message: "Please enter all the fields",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "Could not authenticate user",
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(200).json({
                success: false,
                message: "Post does not exist",
            });
        }

        // console.log(post.postedBy.toString(), req.user._id.toString());
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(200).json({
                success: false,
                message: "You are not authorized to edit this post",
            });
        }

        post.text = text;
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post edited",
        });
    } catch (error) {
        console.log("Error: Unable to edit post");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const editPermission = async (req, res) => {
    try {
        // check whether the user is authorized to edit the post or not
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields",
                permission: false,
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Could not authenticate user",
                permission: false,
            });
        }
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post does not exist",
                permission: false,
            });
        }
        console.log(post.postedBy.toString(), req.user._id.toString());
        if (post.postedBy.toString() !== req.user._id.toString()) {
            console.log("Not Authorized to edit this post");
            return res.status(200).json({
                success: false,
                message: "Not Authorized to edit this post",
                permission: false,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Permission Granted",
            permission: true,
        });
    } catch (error) {
        console.log("Error: Unable to get Permission Parameters");
        return res.status(500).json({
            success: false,
            message: error.message,
            permission: false,
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
