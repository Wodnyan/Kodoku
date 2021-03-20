import { Router } from "express";
import ErrorHandler from "../../lib/error-handler";
import { createAccessToken, verifyRefreshToken } from "../../lib/jwt";
import { limiter } from "../../lib/rate-limiter";
import { RefreshTokenController } from "../../controllers/refresh-token";

const router = Router();

router.use(limiter(100));

router.get("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new ErrorHandler(400, "Provide a token");
    }
    const isBlackListed = await RefreshTokenController.isTokenBlackListed(
      refreshToken
    );
    if (isBlackListed) {
      throw new ErrorHandler(403, "Token is blacklisted");
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
      return next(new ErrorHandler(401, "Provide valid token"));
    }
    next(error);
  }
});

export default router;
