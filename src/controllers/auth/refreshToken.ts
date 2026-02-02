import type { Request, Response, NextFunction } from "express";

import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import logger from "../../config/logger";
import catchAsync from "../../utils/catchAsync";
import { Types } from "mongoose";

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve refreshToken from cookie
    const { refreshToken } = req.cookies;

    // handle case when refreshToken doesn't exists
    if (!refreshToken) {
      logger.warn("Refresh token required");
      res.status(403).json({
        code: "Unauthorized",
        message: "Refresh token is required",
      });
      return;
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    logger.info("New accessToken generated Successfully");
    res.status(200).json({
      accessToken,
    });
  },
);

export default refreshToken;
