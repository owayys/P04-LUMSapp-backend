var pool = require('../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getPin = require('../util/getPin');
const getDatetimeOffset = require('../util/getDatetimeOffset');

require('dotenv').config();

exports.userLogin = (req, res) => {
    const { email, password } = req.body

    var id = email.split("@")[0];

    id = parseInt(id);

    pool.query(`SELECT Password FROM User WHERE ID='${id}'`, (err, results) => {
        if (err) {
            res.json({ err: err })
        }
        else {
            if (results.length === 0 || !results[0]) {
                res.status(401).json({ err: "Unauthorized" });
            }
            else {
                const hashed_password = eval(`results[0].Password`);
                bcrypt.compare(password, hashed_password, (err, comp_result) => {
                    if (comp_result) {
                        const token = jwt.sign(id, process.env.JWT_secret);
                        res.status(200).json({ token });
                    }
                    else res.status(401).json({ err: "Unauthorized" });
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
    const pinExpiry = getDatetimeOffset(2);

    bcrypt.hash(password, 10, (err, hashed_password) => {
        if (err) {
            res.json({ err: err })
        }
        pool.query(`INSERT INTO User (Name, ID, Password, Type, AuthPin, PinExpiry) VALUES ('${name}','${id}','${hashed_password}', '${type.toUpperCase()}', '${authPin}', '${pinExpiry}')`, (err, result) => {
            if (err) {
                res.json({ err: err })
            }
            else {
                const token = jwt.sign(id, process.env.JWT_secret);
                res.status(200).json({ token });
            }
        });
    })

    console.log("Logged signup")
}