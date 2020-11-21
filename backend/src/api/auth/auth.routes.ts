import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../user/user.model";
import { CLIENT_URL } from "../../constants";
import validateRequestBody from "../../lib/validateRequestBody";

const router = Router();

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: `${CLIENT_URL}/chat`,
  })
);

router.post("/register", async (req, res, next) => {
  try {
    // validate inputs
    const bruh = await validateRequestBody(req.body);
    const { email, password, username } = req.body;
    const isEmailUsed = await User.query().where({ email }).first();
    if (isEmailUsed) {
      const error = new Error("Email is in use.");
      res.status(409);
      return next(error);
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.transaction(async (trx) => {
      const newUser = await User.query().insertAndFetch({
        username: username,
        password: hashed,
        email,
      });
      const provider = await newUser
        .$relatedQuery<any>("provider", trx)
        .insert({
          provider: "local",
          provider_id: newUser.id,
          user_id: newUser.id,
        });
      return {
        id: newUser.id,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        email,
      };
    });
    req.login(user, (error) => {
      if (error) return next(error);
      res.redirect(CLIENT_URL);
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${CLIENT_URL}/auth/login`,
  }),
  function (req, res) {
    res.redirect(`${CLIENT_URL}/chat`);
  }
);

export default router;
