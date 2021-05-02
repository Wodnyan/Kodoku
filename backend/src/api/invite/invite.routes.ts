import { Router } from "express";
import { InviteController } from "../../controllers/invite";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router({
  mergeParams: true,
});

const inviteController = new InviteController();

router.get("/", protectRoute, async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const inviteCode = await inviteController.create(Number(serverId));
    return res.status(201).json({
      inviteCode,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
