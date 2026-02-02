import type { Request, Response, NextFunction } from "express";

import User from "../../model/userModel";
import config from "../../config/config.env";
import logger from "../../config/logger";
import catchAsync from "../../utils/catchAsync";

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken as string;

    if (refreshToken) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });

      logger.info("User refresh Token deleted successfully");
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: "success",
      message: "User logged out successfully...",
    });
    logger.info("User logged out successfully...");
  },
);

export default logOut;
