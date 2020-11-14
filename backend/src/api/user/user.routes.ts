import { Router } from "express";
import User from "./user.model";

const router = Router();

router.get("/", async (req, res, next) => {
  const users = await User.query();
  res.json({
    users,
  });
});

export default router;
