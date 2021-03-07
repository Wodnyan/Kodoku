import { Router } from "express";
import { RoomController } from "../../controllers/room";
import { protectRoute } from "../../middlewares/middlewares";
import messages from "../message/message.routes";

const router = Router({
  mergeParams: true,
});
const roomController = new RoomController();

router.get("/", async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const rooms = await roomController.getAll(Number(serverId));
    res.json({
      message: "All rooms",
      rooms,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", protectRoute, async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { roomName } = req.body;
    const newRoom = await roomController.create(Number(serverId), roomName);
    res.status(201).json({
      message: "New server",
      room: newRoom,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:roomId", protectRoute, async (req, res, next) => {
  try {
    const { roomId, serverId } = req.params;
    await roomController.delete(Number(serverId), Number(roomId));
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

router.use("/:roomId/messages", messages);

export default router;
