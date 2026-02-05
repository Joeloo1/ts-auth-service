import dotenv from "dotenv";
import { StringValue } from "ms";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as StringValue,
  WHITELIST_ADMINS_MAIL: process.env.WHITELIST_ADMINS_MAIL?.split(",") || [],
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  VERIFICATION_SECRET: process.env.VERIFICATION_SECRET!,
  VERIFICATION_SECRET_EXPIRES: process.env
    .VERIFICATION_SECRET_EXPIRES as StringValue,
  CLIENT_URL: process.env.CLIENT_URL,
};

export default config;
