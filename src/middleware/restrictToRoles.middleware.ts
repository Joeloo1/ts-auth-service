import { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError";
import logger from "../config/logger";

const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      logger.warn("User not authorized to perform this action");
      return next(
        new AppError("you do not have permission to perform this ation", 403),
      );
    }
    next();
  };
};

export default restrictTo;
