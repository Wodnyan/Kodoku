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
    console.log(userId);
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

// router.get("/", async (req, res, next) => {
//   const { roomId } = req.query;
//   try {
//     const messages = await Message.query()
//       .joinRelated("user")
//       .where({ room_id: roomId })
//       .select(["user.username as sender", "messages.id", "messages.body"])
//       .skipUndefined();
//     res.json({
//       message: "Messages",
//       messages,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
