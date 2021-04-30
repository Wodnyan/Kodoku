import { Router } from "express";
import { RefreshTokenController } from "../../controllers/refresh-token";
import { ValidationError } from "../../lib/exceptions/validation";

const router = Router();

// To be used internally
router.post("/", async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new ValidationError("Provide a token");
    }
    await RefreshTokenController.blackList(token);
    res.json({
      message: "Token blacklisted",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
