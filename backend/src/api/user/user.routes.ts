import { Router } from "express";
import server from "../../app";
import { MemberController } from "../../controllers/member";
import { ServerController } from "../../controllers/server";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router();
const serverController = new ServerController();

// const memberController = new MemberController();
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
    const servers = await serverController.getAll(Number(userId));
    res.json({
      servers,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
