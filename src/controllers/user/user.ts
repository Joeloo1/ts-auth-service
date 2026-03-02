import type { Request, Response, NextFunction } from "express";

import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import logger from "../../config/logger";
import User from "../../model/userModel";

/**
 * UPDATE USER
 */
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      logger.warn(
        `User attempts to user the updateMe routes to update password`,
      );
      return next(
        new AppError(
          "This routes is not for password Update. Please use /updateMyPassword routes",
          400,
        ),
      );
    }

    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const udateUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      status: "success",
      data: { udateUser },
    });
  },
);

/**
 * GET USER
 */
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    req.params.id = req.user._id.toString();
    next();
  },
);

/**
 * DELETE ME
 */
export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const user = await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
