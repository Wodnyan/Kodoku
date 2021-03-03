import { Router } from "express";
import { checkAuth } from "../../middlewares/middlewares";

const router = Router();

// All Users
router.get("/", checkAuth, (req, res) => {
  const user = req.user;
  res.json({
    user,
    message: "User",
  });
});

// One User
router.get("/:userId", (req, res) => {});

export default router;
