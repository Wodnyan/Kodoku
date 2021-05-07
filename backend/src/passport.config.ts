import axios from "axios";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { UserController } from "./controllers/user";
import { createRefreshToken } from "./lib/jwt";
import { authController } from "./controllers/auth";

dotenv.config();

const setup = () => {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:5050/api/v1/auth/github/callback",
      },
      async function (
        accessToken: string,
        _: string,
        profile: any,
        done: Function
      ) {
        try {
          const {
            data: [{ email }],
          } = await axios.get("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          });
          const alreadyExists = await UserController.getOneByEmail(email);
          if (!alreadyExists) {
            const { refreshToken } = await authController.oAuthSignUp({
              email,
              username: profile.username,
              avatarUrl: profile._json.avatar_url,
            });
            done(null, { refreshToken });
          } else {
            const refreshToken = await createRefreshToken(alreadyExists.id);
            done(null, {
              refreshToken,
            });
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
export default setup;
