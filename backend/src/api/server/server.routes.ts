import { Router } from "express";
import { protectRoute } from "../../middlewares/auth";
import members from "../member/member.routes";
import invites from "../invite/invite.routes";
import rooms from "../room/room.routes";
import { validateServerParamIdMiddleWare } from "../../lib/validators/validate-server";
import {
  createServer,
  deleteServer,
  getAllServers,
  getOneServer,
  updateServer,
} from "./server.controller";

const router = Router();

router.get("/", getAllServers);

router.post("/", protectRoute, createServer);

router.get("/:serverId", validateServerParamIdMiddleWare, getOneServer);

router.put(
  "/:serverId",
  validateServerParamIdMiddleWare,
  protectRoute,
  updateServer
);

router.delete(
  "/:serverId",
  validateServerParamIdMiddleWare,
  protectRoute,
  deleteServer
);

// Check if server id is an integer
router.use("/:serverId", validateServerParamIdMiddleWare);
router.use("/:serverId/members", members);
router.use("/:serverId/invites", invites);
router.use("/:serverId/rooms", rooms);

export default router;
