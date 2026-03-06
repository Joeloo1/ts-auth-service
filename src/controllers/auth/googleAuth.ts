import { Request, Response, NextFunction } from "express";

import User from "../../model/userModel";
import { IUser } from "../../model/userModel";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import logger from "../../config/logger";
import { generateRefreshToken, generateAccessToken } from "../../utils/jwt";

export const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;

    if (!user) {
      logger.warn("Google Authentication Failed");
      return next(new AppError("Authentication failed", 401));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    logger.info("Google login successful", {
      userId: user._id,
      email: user.email,
    });

    res.status(200).json({
      status: "success",
      accessToken,
      refreshToken,
    });
  },
);
