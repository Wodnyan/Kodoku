import { Router } from "express";
import { ServerController } from "../../controllers/server";
import ErrorHandler from "../../lib/error-handler";
import { protectRoute } from "../../middlewares/middlewares";
import members from "../member/member.routes";
import invites from "../invite/invite.routes";
import rooms from "../room/room.routes";
import { validateServerParamIdMiddleWare } from "../../lib/validators/validate-server";

const router = Router();

const serverController = new ServerController();

router.get("/", async (req, res, next) => {
  try {
    const allServers = await serverController.getAll();
    return res.json({
      servers: allServers,
    });
  } catch (error) {
    next(error);
  }
});

// TODO: write validation
router.post("/", protectRoute, async (req, res, next) => {
  const { name, ownerId, icon } = req.body;
  try {
    const newServer = await serverController.create(ownerId, name, icon);
    res.status(201).json({
      newServer,
    });
  } catch (error) {
    if (error.errors?.length > 0) {
      return next(new ErrorHandler(400, error.message, error.errors));
    }
    next(error);
  }
});

router.get(
  "/:serverId",
  validateServerParamIdMiddleWare,
  async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const server = await serverController.getOne(Number(serverId));
      if (!server) {
        return next(new ErrorHandler(404, "No server found"));
      }
      return res.json({
        server,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:serverId",
  validateServerParamIdMiddleWare,
  protectRoute,
  async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const updated = await serverController.update(Number(serverId), req.body);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:serverId",
  validateServerParamIdMiddleWare,
  protectRoute,
  async (req, res, next) => {
    try {
      const { serverId } = req.params;
      await serverController.delete(Number(serverId));
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
);

// Check if server id is an integer
router.use("/:serverId", validateServerParamIdMiddleWare);
router.use("/:serverId/members", members);
router.use("/:serverId/invites", invites);
router.use("/:serverId/rooms", rooms);

export default router;
