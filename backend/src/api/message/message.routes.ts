import { Router } from "express";
import { MessageController } from "../../controllers/message";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router({
  mergeParams: true,
});

const messageController = new MessageController();

router.post("/", protectRoute, async (req, res, next) => {
  try {
    const { id } = req.user as any;
    const { roomId } = req.params;
    const { message } = req.body;
    const newMessage = await messageController.create(
      Number(roomId),
      Number(id),
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
