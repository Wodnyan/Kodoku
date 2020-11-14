import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../user/user.model";

dotenv.config();

const router = Router();

router.get("/github", (req, res, next) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

router.get("/github/callback", async (req, res, next) => {
  const { code } = req.query;
  try {
    const { data } = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`
    );
    // Get the token from the response.
    const [, accessToken] = data.split("&")[0].split("=");
    const { data: userData } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    console.log(accessToken);
    const payload = {
      username: userData.login,
      github_id: userData.id,
      avatar_url: userData.avatar_url,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET!);
    res.json({
      user: payload,
      token,
    });
  } catch (error) {
    res.status(error.response?.status || 500);
    next(error);
  }
});

export default router;
