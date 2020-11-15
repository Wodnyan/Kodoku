import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User, { Provider } from "../user/user.model";

dotenv.config();

interface Payload {
  username: string;
  email: string;
  github_id: number;
  avatar_url: string;
}

const router = Router();

router.get("/github", (req, res, next) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`
  );
});

router.get("/github/callback", async (req, res, next) => {
  const { code } = req.query;
  try {
    // Authenticate the code i got from github.
    const { data } = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`
    );
    // Get the token from the response.
    const [, accessToken] = data.split("&")[0].split("=");
    // Get the user data from github.
    const { data: userData } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    // Get the email from github.
    const {
      data: [email],
    } = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const payload: Payload = {
      username: userData.login,
      email: email.email,
      github_id: userData.id,
      avatar_url: userData.avatar_url,
    };
    // TODO: Look up if user already exists.
    const alreadyExists = await User.query()
      .where({ email: payload.email })
      .joinRelated("provider")
      .select([
        "users.id",
        "users.username",
        "users.email",
        "users.avatar_url",
        "provider.provider",
      ])
      .first();
    if (!alreadyExists) {
      const user = await User.transaction(async (trx) => {
        const newUser = await User.query(trx).insertAndFetch({
          username: payload.username,
          avatar_url: payload.avatar_url,
          email: payload.email,
        });
        const provider = await newUser
          .$relatedQuery<any>("provider", trx)
          .insert({
            provider: "github",
            provider_id: payload.github_id,
            user_id: newUser.id,
          });
        return {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar_url: newUser.avatar_url,
          provider: provider.provider,
        };
      });
      res.json({
        user,
      });
    } else {
      res.json({
        user: alreadyExists,
      });
    }
  } catch (error) {
    res.status(error.response?.status || 500);
    next(error);
  }
});

export default router;
