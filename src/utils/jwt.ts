import jwt, { JwtPayload } from "jsonwebtoken";

import { Types } from "mongoose";
import config from "../config/config.env";

interface TokenPayload extends JwtPayload {
  email: string;
}

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

// Verify Access Tokrn
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
};

export const generateVerificationToken = (email: string): string => {
  return jwt.sign({ email }, config.VERIFICATION_SECRET, {
    expiresIn: "2h",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, config.VERIFICATION_SECRET) as TokenPayload;
  return decoded;
};
