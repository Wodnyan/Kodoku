import { Router } from "express";
import passport from "passport";
import { CLIENT_URL } from "../../constants";
import { AuthController } from "../../controllers/auth";
import { UserController } from "../../controllers/user";
import ErrorHandler from "../../lib/error-handler";
import { limiter } from "../../lib/rate-limiter";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router();

router.use(limiter(100));

const userController = new UserController();

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
    if (error.errors?.length > 0) {
      next(new ErrorHandler(400, error.message, error.errors));
    }
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
    if (error.errors?.length > 0) {
      next(new ErrorHandler(400, error.message, error.errors));
    }
    next(error);
  }
});

router.get("/check", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.user as any;
    const user = await userController.getOne(id);
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
