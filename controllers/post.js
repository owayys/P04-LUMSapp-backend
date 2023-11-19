var pool = require('../db/index');
const { v4: uuidv4 } = require('uuid');
const structurePosts = require('../util/structurePosts');

exports.postCreate = (req, res) => {
    var { masterID, parentID, userID, content, timePosted } = req.body;
    var postID = uuidv4()

    if (masterID == null) {
        masterID = postID;
    }

    if (parentID != null) {
        pool.query(`UPDATE Post SET Comments = Comments + 1 WHERE UserID = ${userID} AND PostID = '${parentID}'`, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.json({ err: err.code })
                }
                else {
                    throw err;
                }
            }
        });
    }

    pool.query(`INSERT INTO Post (PostID, MasterID, ParentID, UserID, Content, TimePosted, LastEdited) VALUES ('${postID}','${masterID}',${parentID != null ? `'${parentID}'` : parentID},${userID}, '${content}', '${timePosted}', '${timePosted}')`, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.json({ err: err.code })
            }
            else {
                throw err;
            }
        }
        else {
            res.status(200).json({ postID: postID });
        }
    });
}

exports.postDelete = (req, res) => {
    const { postID } = req.body;

    pool.query(`SELECT ParentID FROM Post WHERE PostID = '${postID}'`, (err, result) => {
        if (err) {
            console.log(err)
        }
        var parentID = result[0].ParentID
        if (parentID != null) {
            pool.query(`UPDATE Post SET Comments = Comments - 1 WHERE PostID = '${parentID}'`, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
        }
    });


    pool.query(`DELETE FROM Post WHERE PostID = '${postID}'`, (err, result) => {
        if (err) {
            res.json({ err: err });
        }
        else {
            res.status(200);
        }
    });
}

exports.postGet = (req, res) => {
    const { postID } = req.body;
    console.log(postID)
    pool.query(`SELECT * FROM Post WHERE MasterID = '${postID}'`, (err, results) => {
        if (err) {
            res.json({ err: err })
        } else {
            var structuredPosts = structurePosts(results)
            res.status(200).json({ results: structuredPosts });
        }
    });
}

exports.postFeed = (req, res) => {
    const { postLimit } = req.body;
    pool.query(`SELECT * FROM Post WHERE MasterID = PostID ORDER BY TimePosted DESC LIMIT ${postLimit}`, (err, results) => {
        if (err) {
            res.json({ err: err })
        } else {
            var structuredPosts = structurePosts(results)
            res.status(200).json({ results: structuredPosts });
        }
    });
}

