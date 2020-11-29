import { Router } from "express";
import Room from "./room.model";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { serverId } = req.query;
    const rooms = await Room.query()
      .where({ server_id: serverId })
      .skipUndefined();
    res.json({
      message: "All rooms",
      rooms,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { serverId, name } = req.body;
    const newRoom = await Room.query().insertAndFetch({
      server_id: serverId,
      name,
    });
    res.status(201).json({
      message: "New server",
      room: newRoom,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:roomId", async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const deleteRoom = await Room.query().findById(roomId).delete();
    res.json({
      message: "Deleted room",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
