import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      return null;
    }

    const result = await cloudinary.uploader.upload(localPath, { resource_type: "image" });
    logger.info(`File uploaded successfully ${localPath}`);
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(localPath);
    return null;
  }
};

export { uploadOnCloudinary };
