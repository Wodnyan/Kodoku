import { Router } from "express";
import ErrorHandler from "../../lib/error-handler";
import { createAccessToken, verifyRefreshToken } from "../../lib/jwt";
import { limiter } from "../../lib/rate-limiter";

const router = Router();

router.use(limiter(100));

router.get("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    const payload = (await verifyRefreshToken(refreshToken)) as any;
    const accessToken = await createAccessToken(payload.userId);
    res.json({
      accessToken,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new ErrorHandler(401, "Provide valid token"));
    }
    next(error);
  }
});

export default router;
