var pool = require('../db/index');
const bcrypt = require('bcrypt');
const getPin = require('../util/getPin');

exports.userLogin = (req, res) => {
    const { email, password } = req.body

    var id = email.split("@")[0];

    id = parseInt(id);

    pool.query(`SELECT Password FROM User WHERE ID='${id}'`, (err, results) => {
        if (err) {
            res.json({ error: err })
        }
        else {
            if (results.length === 0) {
                res.json({ code: 401 });
            }
            else if (!results[0]) {
                res.json({ code: 401 });
            }
            else {
                const hashed_password = eval(`results[0].Password`);
                bcrypt.compare(password, hashed_password, (err, comp_result) => {
                    if (comp_result) {
                        pool.query(`SELECT ID, Name FROM User WHERE ID='${id}'`, (err, results) => {
                            if (err) {
                                res.json({ error: err })
                            } else {
                                console.log(id, results);
                                res.json({ code: 200, name: results[0].Name, id: results[0].ID });
                            }
                        })
                    }
                    else res.json({ code: 401 });
                })
            }
        }
    });

    console.log("Logged login")
}

exports.userSignup = (req, res) => {
    const { name, email, password, type } = req.body
    console.log(req.body)

    const id = parseInt(email.split('@')[0]);
    const authPin = getPin(6);

    bcrypt.hash(password, 10, (err, hashed_password) => {
        if (err) {
            res.json({ error: err })
        }
        pool.query(`INSERT INTO User (Name, ID, Password, Type, AuthPin) VALUES ('${name}','${id}','${hashed_password}', '${type.toUpperCase()}', '${authPin}')`, (err, result) => {
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
    })

    console.log("Logged signup")
}