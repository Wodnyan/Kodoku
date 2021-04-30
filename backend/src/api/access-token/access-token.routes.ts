import { Router } from "express";
import HttpError from "../../lib/exceptions/error-handler";
import { createAccessToken, verifyRefreshToken } from "../../lib/jwt";
import { limiter } from "../../lib/rate-limiter";
import { RefreshTokenController } from "../../controllers/refresh-token";

const router = Router();

router.use(limiter(100));

router.get("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new HttpError("Provide a token", 400);
    }
    const isBlackListed = await RefreshTokenController.isTokenBlackListed(
      refreshToken
    );
    if (isBlackListed) {
      throw new HttpError("Token is blacklisted", 403);
    }
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
      return next(new HttpError("Provide valid token", 401));
    }
    next(error);
  }
});

export default router;
