import jwt from "jsonwebtoken";

import { Types } from "mongoose";
import config from "../config/config.env";

// Generate Access Token
export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
  });
};

// Generate Refresh Token
export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
};
