import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../../model/userModel";

import User from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import logger from "../../config/logger";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import config from "../../config/config.env";

type LoginBody = Pick<IUser, "email" | "password">;

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginBody;

    // Check if email and password is provided
    if (!email || !password) {
      logger.warn("User tried to login with empty field");
      return next(new AppError("Please provide email and password", 400));
    }

    // Check if the email exist in DB
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      {
        logger.warn(`user tried to login with incorrect email and password`);
        return next(new AppError("Incorrect email and password...", 401));
      }
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refreshToken to DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    logger.info(`User logged in successfully... Email:${email}`);

    res.status(200).json({
      status: "success",
      message: "User logged in Successfully",
      data: {
        user,
      },
      AccessToken: accessToken,
    });
  },
);

export default login;
