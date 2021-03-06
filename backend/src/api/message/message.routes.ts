import { Router } from "express";
import { MessageController } from "../../controllers/message";
import { protectRoute } from "../../middlewares/auth";

const router = Router({
  mergeParams: true,
});

const messageController = new MessageController();

router.post("/", protectRoute, async (req, res, next) => {
  try {
    const { id: userId } = req.user as any;
    const { roomId, serverId } = req.params;
    const { message } = req.body;
    const newMessage = await messageController.create(
      Number(serverId),
      Number(roomId),
      Number(userId),
      message,
    );
    res.status(201).json({
      newMessage,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { limit, offset, orderBy } = req.query;
    const messages = await messageController.getAll(Number(roomId), {
      limit: Number(limit),
      offset: Number(offset),
      orderBy: orderBy as "asc" | "desc",
    });
    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
