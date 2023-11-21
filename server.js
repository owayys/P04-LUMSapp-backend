import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./db/index.js";
import { v2 as cloudinary } from "cloudinary";

config({
    path: "./config.env",
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

;
const port = process.env.PORT || 8000;

connectDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})
