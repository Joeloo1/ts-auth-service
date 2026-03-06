import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import User from "../../model/userModel";
import config from "../config.env";
import logger from "../logger";
import { genUsername } from "../../utils/usernameGen";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_REDIRECT_URL,
    },
    async (
      accessToken,
      refreshToken,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        logger.info("Google OAuth attempt", {
          providerId: profile.id,
          displayName: profile.displayName,
        });

        const email = profile.emails?.[0].value;

        if (!email) {
          logger.warn("Google OAuth failed: no email returned", {
            providerId: profile.id,
          });

          return done(new Error("Email not found"), undefined);
        }

        let user = await User.findOne({ email });

        if (!user) {
          const username = genUsername();

          logger.info("Creating new Google user", {
            email,
            providerId: profile.id,
          });

          user = await User.create({
            email,
            name: profile.displayName,
            role: "user",
            username,
            provider: "GOOGLE",
            providerId: profile.id,
            isVerified: true,
          });

          logger.info("New Google user created", {
            userId: user._id,
            email,
          });
        } else {
          logger.info("Existing user logged in via Google", {
            userId: user._id,
            email,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

export default passport;
