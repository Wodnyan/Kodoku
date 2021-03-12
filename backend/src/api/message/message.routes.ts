import { Router } from "express";
import { MessageController } from "../../controllers/message";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router({
  mergeParams: true,
});

const messageController = new MessageController();

router.post("/", protectRoute, async (req, res, next) => {
  try {
    const { roomId, serverId } = req.params;
    const { userId, message } = req.body;
    const newMessage = await messageController.create(
      Number(serverId),
      Number(roomId),
      Number(userId),
      message
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
    console.log("hello world");
    const { roomId } = req.params;
    const messages = await messageController.getAll(Number(roomId));
    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
