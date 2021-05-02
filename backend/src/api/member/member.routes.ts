import { Router } from "express";
import { MemberController } from "../../controllers/member";
// import { validateJoinServerMiddleware } from "../../lib/validators/validate-member";
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

router.get("/:userId", protectRoute, async (req, res, next) => {
  const { userId, serverId } = req.params;
  try {
    const member = await memberController.getOne(
      Number(serverId),
      Number(userId),
    );
    res.json({
      member,
    });
  } catch (error) {
    next(error);
  }
});

// Join server
router.post(
  "/",
  protectRoute,
  // validateJoinServerMiddleware,
  async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const { inviteCode } = req.body;
      const { id } = req.user as any;
      const newMember = await memberController.create(
        Number(serverId),
        id,
        inviteCode,
      );
      res.status(201).json({
        member: newMember,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete("/", protectRoute, async (req, res, next) => {
  try {
    // TODO: only the owner should be able to delete member.
    const { serverId } = req.params;
    const { userId } = req.body;
    await memberController.delete(Number(serverId), userId);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
