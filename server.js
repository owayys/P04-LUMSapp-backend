import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabse } from "./db/index.js";
import { v2 as cloudinary } from "cloudinary";

config({
  path: "./config.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

connectDatabse();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
