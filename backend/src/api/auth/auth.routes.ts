import { Router } from "express";
import passport from "passport";
import { CLIENT_URL } from "../../constants";
import { AuthController } from "../../controllers/auth";
import ErrorHandler from "../../lib/error-handler";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  res.json({
    user: req.user,
    message: "Login",
  });
});

router.post("/register", async (req, res, next) => {
  try {
    const authController = new AuthController();
    const { accessToken, refreshToken } = await authController.signUp(req.body);
    res.cookie("refresh_token", refreshToken, { httpOnly: true });
    res.status(201).json({
      message: "register",
      accessToken,
    });
  } catch (error) {
    if (error.errors?.length > 0) {
      next(new ErrorHandler(400, error.message, error.errors));
    }
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
  function (_, res) {
    res.redirect(`${CLIENT_URL}/chat`);
  }
);

export default router;
