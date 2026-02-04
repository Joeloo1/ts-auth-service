import { Request, Response, NextFunction } from "express";

import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import logger from "../../config/logger";
import User from "../../model/userModel";
import { verifyToken } from "../../utils/jwt";

const verIfyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Check  if the token exists
    const token = req.query.token as string;

    if (!token) {
      logger.warn("Verification token missing...");
      return next(new AppError("Verification token missing", 400));
    }

    const decoded = verifyToken(token);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      logger.warn("User not found");
      return next(new AppError("User not Found", 404));
    }

    if (user.isVerified) {
      logger.warn("Email already verified...");
      return next(new AppError("Email already verified", 400));
    }

    if (user.verificationToken !== token) {
      logger.warn("Invalid or outdated verification link");
      return next(new AppError("Invalid or Outdated verification link", 400));
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verified successfully: Email: ${user.email}`);
    res.status(200).json({
      message: `Email verified successfully`,
    });
  },
);

export default verIfyEmail;
