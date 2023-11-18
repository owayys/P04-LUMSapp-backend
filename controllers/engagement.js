var pool = require('../db/index');

exports.engagementReact = (req, res) => {
    var { type, postID, userID } = req.body;

    pool.query(`INSERT INTO Engagement (UserID, PostID, Type) VALUES (${userID},'${postID}','${type.toUpperCase()}')`, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(`User [${userID}] used [${type}] on Post [${postID}]`)
        }
    });

    var metric = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + 's'

    pool.query(`UPDATE Post SET ${metric} = ${metric} + 1 WHERE UserID = ${userID} AND PostID = '${postID}'`, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.json({ code: err.code })
            }
            else {
                throw err;
            }
        }
        else {
            res.json({ code: 200 });
        }
    });
}