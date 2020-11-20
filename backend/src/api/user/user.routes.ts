import { Router } from "express";
import { checkAuth } from "../../middlewares/middlewares";
import User from "./user.model";

const router = Router();

router.get("/", checkAuth, (req, res, next) => {
  const user = req.user;
  res.json({
    user,
    message: "User",
  });
});

export default router;
