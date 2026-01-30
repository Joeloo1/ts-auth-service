import mongoose from "mongoose";
import config from "./config.env";
import logger from "./logger";

export const connectDB = async () => {
  try {
    const DBUrl = config.DATABASE_URL;

    if (!DBUrl) {
      logger.error(" ❌ DBUrl is not in .env file");
      throw new Error("❌DBUrl is not in .env file");
    }
    await mongoose.connect(DBUrl);
    logger.info("⭕DATABASE connected successfully");
  } catch (error) {
    logger.error("❌Failed to connect to DATABASE");
  }
};
