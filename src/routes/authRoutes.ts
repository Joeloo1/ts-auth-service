import { Router } from "express";

import signUp from "../controllers/auth/signup";
import login from "../controllers/auth/login";
import logOut from "../controllers/auth/logout";
import protect from "../middleware/protect.Middleware";
import refreshToken from "../controllers/auth/refreshToken";
import verIfyEmail from "../controllers/auth/verify_email";
import passport from "../config/passport";
import { googleCallback } from "../controllers/auth/googleAuth";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(protect, logOut);
router.route("/refresh-token").post(protect, refreshToken);
router.route("/verify-email").get(verIfyEmail);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback,
);

export default router;
