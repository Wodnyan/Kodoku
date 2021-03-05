import { Router } from "express";
import { MemberController } from "../../controllers/member";
import { ServerController } from "../../controllers/server";
import ErrorHandler from "../../lib/error-handler";
import Server from "../server/server.model";
import members from "../member/member.routes";
import { protectRoute } from "../../middlewares/middlewares";

const router = Router();

const serverController = new ServerController();
const memberController = new MemberController();

interface Update {
  name?: string;
  icon?: string;
}

router.get("/", async (req, res, next) => {
  try {
    console.log(req.user);
    const allServers = await serverController.getAll();
    return res.json({
      servers: allServers,
    });
  } catch (error) {
    next(error);
  }
});

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

router.get("/:serverId", async (req, res, next) => {
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
});

// TODO: Refactor this
router.put("/:serverId", protectRoute, async (req, res, next) => {
  const { serverId } = req.params;
  const update = {
    name: req.body.name,
    icon: req.body.icon,
  } as Update;
  try {
    const updatedServer = await Server.query().patch(update).findById(serverId);
    res.json({
      updated: updatedServer,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:serverId", async (req, res, next) => {
  const { serverId } = req.params;
  try {
    await serverController.delete(Number(serverId));
    return res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

router.use("/:serverId/members", members);

export default router;
