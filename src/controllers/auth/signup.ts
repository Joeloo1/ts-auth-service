import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../../model/userModel";

import User from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { genUsername } from "../../utils/usernameGen";
import logger from "../../config/logger";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

type SignUpBody = Pick<
  IUser,
  "username" | "name" | "email" | "role" | "password" | "passwordConfirm"
>;

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, role, password, passwordConfirm } =
      req.body as SignUpBody;

    // Check if passwords match
    if (password !== passwordConfirm) {
      logger.warn("Password do not match");
      return next(new AppError("Password do not match", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.warn(`Attempt to sign up with existing email: ${email}`);
      return next(new AppError("User already exists with the email", 400));
    }

    const username = genUsername();

    // Create user
    const newUser = await User.create({
      username,
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    // Generate Access and Refresh Token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken;
    // Save refreshToken to DB
    await newUser.save({ validateBeforeSave: false });

    logger.info(`New user created successfully ${newUser.email}`);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        newUser,
      },
      accessToken: accessToken,
    });
  },
);

export default signUp;
