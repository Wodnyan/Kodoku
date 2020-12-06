import { Router } from "express";
import Message from "./message.models";

const router = Router();

router.get("/", async (req, res, next) => {
  const { roomId } = req.query;
  try {
    const messages = await Message.query()
      .joinRelated("user")
      .where({ room_id: roomId })
      .select(["user.username as sender", "messages.id", "messages.body"])
      .skipUndefined();
    res.json({
      message: "Messages",
      messages,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
