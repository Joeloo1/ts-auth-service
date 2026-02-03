import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../../model/userModel";

import User from "../../model/userModel";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { genUsername } from "../../utils/usernameGen";
import logger from "../../config/logger";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from "../../utils/jwt";
import { sendEmail, getVerificationEmailHtml } from "../../utils/email_service";
import config from "../../config/config.env";

type SignUpBody = Pick<
  IUser,
  "username" | "name" | "email" | "role" | "password" | "passwordConfirm"
>;

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, role, password, passwordConfirm } =
      req.body as SignUpBody;

    const normalizedEmail = email.toLowerCase().trim();

    // Check whitelist
    const isWhitelisted = config.WHITELIST_ADMINS_MAIL.map((e) =>
      e.toLowerCase(),
    ).includes(normalizedEmail);

    // Assign role automatically
    const userRole: "user" | "admin" = isWhitelisted ? "admin" : "user";
    if (role === "admin" && !isWhitelisted) {
      logger.warn(`Unauthorized admin registration attempt: ${email}`);
      return next(new AppError("You cannot register as admin", 403));
    }

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

    // Generate verificationToken
    const token = generateVerificationToken(email);
    const tokenExpiry = new Date(Date.now() * 60 * 60 * 1000);

    // Create user
    const newUser = await User.create({
      username,
      name,
      email,
      password,
      passwordConfirm,
      role: userRole,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

    // Generate Access and Refresh Token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.verificationToken = token;
    newUser.refreshToken = refreshToken;
    newUser.verificationTokenExpiry = tokenExpiry;
    // Save refreshToken to DB
    await newUser.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    await sendEmail({
      email: email,
      subject: "Verify Your Email Address",
      html: getVerificationEmailHtml(verifyUrl),
    });

    logger.info(`New user created successfully ${newUser.email}`);

    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({
      status: "success",
      message:
        "User registered successfully, Please check your email to verify your account",
      data: {
        newUser: userResponse,
      },
      accessToken: accessToken,
    });
  },
);

export default signUp;
