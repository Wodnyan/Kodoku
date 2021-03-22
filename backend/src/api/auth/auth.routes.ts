import { Router } from "express";
import passport from "passport";
import { CLIENT_URL } from "../../constants";
import { AuthController } from "../../controllers/auth";
import { RefreshTokenController } from "../../controllers/refresh-token";
import { UserController } from "../../controllers/user";
import ErrorHandler from "../../lib/error-handler";
import { limiter } from "../../lib/rate-limiter";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router();

router.use(limiter(100));

router.post("/login", async (req, res, next) => {
  try {
    const authController = new AuthController();
    const { accessToken, refreshToken } = await authController.login(req.body);
    res.cookie("refresh_token", refreshToken, { httpOnly: true });
    res.json({
      message: "login",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
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
    next(error);
  }
});

router.get("/logout", protectRoute, async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    await RefreshTokenController.blackList(refreshToken);

    res.status(204).json({
      message: "Logged out",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/check", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.user as any;
    const user = await UserController.getOne(id);
    res.json({
      user,
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
  function (_, res) {
    res.redirect(`${CLIENT_URL}/chat`);
  }
);

export default router;
