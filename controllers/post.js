var pool = require('../db/index');
const { v4: uuidv4 } = require('uuid');
const structurePosts = require('../util/structurePosts');

const Post = require('../models/post');


exports.postCreate = (req, res) => {
    
   

    const {text,likedBy,dislikedBy,comments,postedBy,media,likeCount,dislikeCount,commentCount,bookmarkCount} = req.body;

    const newPost = new Post({
        text,
        likedBy,
        dislikedBy,
        comments,
        postedBy,
        media,
        likeCount,
        dislikeCount,
        commentCount,
        bookmarkCount
    });

    

    newPost.save()
        .then(() => {
            res.json({ code: 200, postID: postID });
        })
        .catch((err) => {
            if (err.code === 11000) {
                res.json({ code: err.code });
            } else {
                throw err;
            }
        });
}

exports.postDelete = (req, res) => {
    const { postID } = req.body;

    pool.query(`DELETE FROM Post WHERE PostID = '${postID}'`, (err, result) => {
        if (err) {
            res.json({ error: err });
        }
        else {
            res.json({ code: 200 });
        }
    });
}

exports.postGet = (req, res) => {
    const { postID } = req.body;
    console.log(postID)
    pool.query(`SELECT * FROM Post WHERE MasterID = '${postID}'`, (err, results) => {
        if (err) {
            res.json({ error: err })
        } else {
            var structuredPosts = structurePosts(results)
            res.json({ code: 200, results: structuredPosts });
        }
    });
}

exports.postFeed = (req, res) => {
    const { postLimit } = req.body;
    pool.query(`SELECT * FROM Post WHERE MasterID = PostID ORDER BY TimePosted DESC LIMIT ${postLimit}`, (err, results) => {
        if (err) {
            res.json({ error: err })
        } else {
            var structuredPosts = structurePosts(results)
            res.json({ code: 200, results: structuredPosts });
        }
    });
}

