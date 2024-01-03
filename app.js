import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import User from "./routers/user.js";
import Post from "./routers/post.js";
import Comment from "./routers/comment.js";
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
        limits: { fileSize: 100 * 1024 * 1024 },
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

app.post('/api/transcript', (req , res) => {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      sampleFile = req.files.file;
      uploadPath = '/workspaces/P04-LUMSapp-backend' + '/uploads/' + sampleFile.name;
    
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv(uploadPath, function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
    });
});

app.get('/', (req, res) => {
    res.send('P04-LUMSapp-backend')
})

app.get('*', (req, res) => {
    res.status(404).json({ err: "Not found" });
});
