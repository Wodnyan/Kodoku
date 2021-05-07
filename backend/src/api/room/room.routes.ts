import { Router } from "express";
import { protectRoute } from "../../middlewares/auth";
import messages from "../message/message.routes";
import { createRoom, deleteRoom, getAllRooms } from "./room.controller";

const router = Router({
  mergeParams: true,
});

router.get("/", getAllRooms);

router.post("/", protectRoute, createRoom);

router.delete("/:roomId", protectRoute, deleteRoom);

router.use("/:roomId/messages", messages);

export default router;
