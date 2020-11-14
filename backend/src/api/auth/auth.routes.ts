import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
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
  const { data } = await axios.post(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`
  );
  // Get the token from the response.
  const [, token] = data.split("&")[0].split("=");
  const { data: user } = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  console.log(user);
  res.json({
    user,
    token,
  });
});

export default router;
