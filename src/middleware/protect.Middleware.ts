import { Request, Response, NextFunction } from "express";

import User from "../model/userModel";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import logger from "../config/logger";
import { verifyAccessToken } from "../utils/jwt";

import { ITokenPayload } from "../types/auth.types";

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the Token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      logger.warn("Unauthorizied user...");
      return next(
        new AppError(
          "You are not logged in, Please log in to access this route",
          400,
        ),
      );
    }

    // Verify Token
    const decoded = verifyAccessToken(token) as ITokenPayload;

    // Chwck if the user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      logger.warn("User with this token no longer exists");
      return next(new AppError("User with this token no  longer exists", 401));
    }

    if (!currentUser.isVerified) {
      logger.warn("User email not verified");
      return next(
        new AppError("Please Verify your email to access this routes", 401),
      );
    }

    // Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat as number)) {
      logger.warn("User recently changed password");
      return next(
        new AppError("You recently changed password, Please login again", 401),
      );
    }
    req.user = currentUser;
    next();
  },
);

export default protect;
