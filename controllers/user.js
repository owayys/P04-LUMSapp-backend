// var pool = require("../db/index");
import bcrypt from "bcrypt";
import { getPin } from "../util/getPin.js";

import { User } from "../models/user.js";
import { sendToken } from "../util/sendToken.js";
import { sendMail } from "../util/sendMail.js";
import { Post } from "../models/post.js";
import cloudinary from "cloudinary";

export const userSignup = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields",
            });
        }

        email = email.trim();

        const domain = email.split("@")[1];

        if (domain !== "lums.edu.pk") {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid LUMS email ID",
            });
        }

        const id = email.split("@")[0];
        const regex = /^[0-9]+$/;

        if (!regex.test(id) || (id.length !== 8 && id !== "studentcouncil")) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid LUMS email ID",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            //   console.log(user.verified);
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 characters long",
            });
        }

        const otp = getPin(6);
        let role;

        if (id === "studentcouncil") {
            role = "council";
        } else {
            role = "student";
        }

        await sendMail(email, otp);

        user = await User.create({
            fullname: name,
            email,
            password,
            role,
            otp,
            otpExpire: Date.now() + 5 * 60 * 1000,
            profile_picture: {
                public_id: "",
                url: "",
            },
        });

        sendToken(res, user, 201, "OTP sent successfully");
    } catch (error) {
        console.log("Error: Unable to signup");
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const userVerify = async (req, res) => {
    try {
        // console.log("Verifying");
        const otp = req.body.otp;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Please enter the OTP",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        } else if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        user.verified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();
        sendToken(res, user, 200, "User verified successfully");
    } catch (error) {
        console.log("Error: Unable to verify user");
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const userLogin = async (req, res) => {
    try {
        console.log("Logging in");
        let { email, password } = req.body;
        email = email.trim();

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields",
            });
        }

        let user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // console.log(user.email);
        if (!user.verified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        sendToken(res, user, 200, "Logged in successfully");
    } catch (error) {
        console.log("Error: Unable to login");
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        console.log("Logout");
        return res
            .status(200)
            .cookie("token", null, {
                expires: new Date(Date.now()),
            })
            .json({
                success: true,
                message: "Logged out",
            });
    } catch (error) {
        console.log("Error: Unable to logout");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }
        console.log(user);

        sendToken(res, user, 200, "User profile fetched successfully");
    } catch (error) {
        console.log("Error: Unable to get user profile");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const bookmarkPost = async (req, res) => {
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

        const index = user.bookmarks.indexOf(postId);
        if (index !== -1) {
            post.bookmarkCount -= 1;
            await post.save();
            user.bookmarks.splice(index, 1);
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Bookmark removed",
            });
        }

        post.bookmarkCount += 1;
        console.log(post);
        await post.save();
        user.bookmarks.push(postId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Post bookmarked",
        });
    } catch (error) {
        console.log("Error: Unable to bookmark post");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    console.log(req.body, req.files?.icon);
    let { username, bio } = req.body;
    let icon = req.files?.icon;

    if (!username) {
        return res.status(200).json({
            success: false,
            message: "Invalid username",
        });
    }
    if (!bio) {
        return res.status(200).json({
            success: false,
            message: "Invalid bio",
        });
    }
    if (!icon) {
        return res.status(200).json({
            success: false,
            message: "Invalid icon",
        });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(200).json({
            success: false,
            message: "User does not exist",
        });
    }

    // const result = await cloudinary.v2.uploader.upload_stream({
    //     folder: `LUMSApp/icons/${user._id}`,
    // });

    cloudinary.v2.uploader
        .upload_stream({}, async (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Error uploading data",
                });
            }
            user.profile_picture.url = result.secure_url;
            user.profile_picture.public_id = result.public_id;
            user.bio = bio;
            // user.fullname = username;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Profile updated",
            });
        })
        .end(icon.data);
};

// exports.userLogin = (req, res) => {
//   try {
//     const { email, password } = req.body;

//     var id = email.split("@")[0];

//     id = parseInt(id);

//     pool.query(`SELECT Password FROM User WHERE ID='${id}'`, (err, results) => {
//       if (err) {
//         res.json({ error: err });
//       } else {
//         if (results.length === 0) {
//           res.json({ code: 401 });
//         } else if (!results[0]) {
//           res.json({ code: 401 });
//         } else {
//           const hashed_password = eval(`results[0].Password`);
//           bcrypt.compare(password, hashed_password, (err, comp_result) => {
//             if (comp_result) {
//               pool.query(
//                 `SELECT ID, Name FROM User WHERE ID='${id}'`,
//                 (err, results) => {
//                   if (err) {
//                     res.json({ error: err });
//                   } else {
//                     console.log(id, results);
//                     res.json({
//                       code: 200,
//                       name: results[0].Name,
//                       id: results[0].ID,
//                     });
//                   }
//                 }
//               );
//             } else res.json({ code: 401 });
//           });
//         }
//       }
//     });

//     console.log("Logged login");
//   } catch (error) {
//     console.log("Something went wrong");
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.userSignup = (req, res) => {
//   try {
//     const { name, email, password, type } = req.body;
//     console.log(req.body);

//     const id = parseInt(email.split("@")[0]);
//     const authPin = getPin(6);

//     bcrypt.hash(password, 10, (err, hashed_password) => {
//       if (err) {
//         res.json({ error: err });
//       }
//       pool.query(
//         `INSERT INTO User (Name, ID, Password, Type, AuthPin) VALUES ('${name}','${id}','${hashed_password}', '${type.toUpperCase()}', '${authPin}')`,
//         (err, result) => {
//           if (err) {
//             if (err.code === "ER_DUP_ENTRY") {
//               res.json({ code: err.code });
//             } else {
//               throw err;
//             }
//           } else {
//             res.json({ code: 200 });
//           }
//         }
//       );
//     });

//     console.log("Logged signup");
//   } catch (error) {
//     console.log("Something went wrong");
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
