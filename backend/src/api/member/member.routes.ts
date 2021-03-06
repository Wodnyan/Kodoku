import { Router } from "express";
import { MemberController } from "../../controllers/member";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router({
  mergeParams: true,
});

const memberController = new MemberController();

router.get("/", async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const members = await memberController.getAll(Number(serverId));
    res.json({
      members,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", protectRoute, async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { inviteCode, userId } = req.body;
    // TODO: Write validation for this
    const newMember = await memberController.create(
      Number(serverId),
      userId,
      inviteCode
    );
    res.status(201).json({
      newMember,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", protectRoute, async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { userId } = req.body;
    await memberController.delete(Number(serverId), userId);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
