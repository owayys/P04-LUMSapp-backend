import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import User from "./routers/user.js";
import Post from "./routers/post.js";
import Comment from "./routers/comment.js";
import Transcript from "./routers/transcript.js";
import Course from "./routers/course.js";
import Instructor from "./routers/instructor.js";
import Review from "./routers/reviews.js";

// require("dotenv").config();

// var connection = require("./db/index");

// const PORT = process.env.PORT || 8080;

export const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        limits: { fileSize: 50 * 1024 * 1024 },
    })
);

// app.use("/api/user", require("./routers/user"));
// // app.use('/api/post', routers.postRouter)
// // app.use('/api/engagement', routers.engagementRouter)

// app.listen(PORT, () => {
//   console.log(`Server is listening on port: ${PORT}...`);

//   // if (connection.state === 'disconnected') {
//   //     return respond(null, { status: 'fail', message: 'server down' });
//   // }
// });

// app.get("/", (req, res) => {
//   res.send("HOME");
// });

// app.get("*", (req, res) => {
//   res.status(404).json({ code: 404 });
// });

app.use("/api/user", User);
app.use("/api/post", Post);
app.use("/api/comment", Comment);
app.use("/api/transcript", Transcript);
app.use("/api/course", Course);
app.use("/api/instructor", Instructor);
app.use("/api/review", Review);

app.get("/", (req, res) => {
    res.send("P04-LUMSapp-backend");
});

app.get("/", (req, res) => {
    res.send("P04-LUMSapp-backend");
});

app.get("*", (req, res) => {
    res.status(404).json({ err: "Not found" });
});
