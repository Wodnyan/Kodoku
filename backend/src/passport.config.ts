import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import axios from "axios";
import User from "./api/user/user.model";
import bcrypt from "bcrypt";

dotenv.config();

const setup = () => {
  passport.serializeUser((user: any, done) => {
    return done(null, {
      id: user.id,
    });
  });
  passport.deserializeUser(async ({ id }, done) => {
    try {
      const userInfo = await User.query()
        .where({ id })
        .skipUndefined()
        .select(["id", "username", "email", "avatar_url"])
        .first();
      done(null, userInfo);
    } catch (error) {
      done(error);
    }
  });
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await User.query().where({ email }).first();
          if (!user) return done(null, false);
          const dehashedPassword = await bcrypt.compare(
            password,
            user.password
          );
          if (!dehashedPassword) return done(null, false);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:5050/api/v1/auth/github/callback",
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function
      ) {
        // Get the email of the user
        try {
          const {
            data: [{ email }],
          } = await axios.get("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          });
          const alreadyExists = await User.query()
            .where({ email })
            .joinRelated("provider")
            .first();
          if (!alreadyExists) {
            const user = await User.transaction(async (trx) => {
              const newUser = await User.query().insertAndFetch({
                username: profile.username,
                avatar_url: profile._json.avatar_url,
                email,
              });
              const provider = await newUser
                .$relatedQuery<any>("provider", trx)
                .insert({
                  provider: "github",
                  provider_id: profile.id,
                  user_id: newUser.id,
                });
              done(null, {
                id: newUser.id,
                username: newUser.username,
                avatar_url: newUser.avatar_url,
                email,
              });
            });
          } else {
            done(null, {
              id: alreadyExists.id,
              username: alreadyExists.username,
              avatar_url: alreadyExists.avatar_url,
              email,
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