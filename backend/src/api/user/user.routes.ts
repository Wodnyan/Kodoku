import { Router } from "express";
import { ServerController } from "../../controllers/server";
import { protectRoute } from "../../middlewares/auth";

const router = Router();
// const serverController = new ServerController();

// All Users
router.get("/", protectRoute, (req, res) => {
  const user = req.user;
  res.json({
    user,
    message: "User",
  });
});

// Get all servers where user is member
router.get("/:userId/servers", protectRoute, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const servers = await ServerController.getAll(Number(userId));
    res.json({
      servers,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
