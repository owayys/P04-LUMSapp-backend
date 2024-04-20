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
import Event from "./routers/event.js";
import Location from "./routers/location.js";
import Notification from "./routers/notification.js";
import Donations from "./routers/donations.js";

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

app.use("/api/user", User);
app.use("/api/post", Post);
app.use("/api/comment", Comment);
app.use("/api/transcript", Transcript);
app.use("/api/course", Course);
app.use("/api/instructor", Instructor);
app.use("/api/review", Review);
app.use("/api/event", Event);
app.use("/api/location", Location);
app.use("/api/notification", Notification);
app.use("/api/donations", Donations);

app.get("/", (req, res) => {
    res.send("P04-LUMSapp-backend");
});

app.get("*", (req, res) => {
    res.status(404).json({ err: "Not found" });
});
