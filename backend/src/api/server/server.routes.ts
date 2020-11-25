import { Router } from "express";
import validateServer from "../../lib/validateServer";
import Server from "../server/server.model";

const router = Router();

interface Update {
  name?: string;
  icon?: string;
}

router.get("/", async (req, res, next) => {
  const { userId } = req.query;
  const servers = await Server.query();
  try {
    res.json({
      servers,
      message: "All Servers",
      userId,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, ownerId, icon } = req.body;
  try {
    await validateServer({
      name,
      ownerId,
      icon,
    });
    const newServer = await Server.query().insertAndFetch({
      name,
      owner_id: ownerId,
      icon,
    });
    res.status(201).json({
      message: "Created a new server",
      newServer,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:serverId", async (req, res, next) => {
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
    const newServer = await Server.query().where({ id: serverId }).delete();
    res.status(201).json({
      message: "Deleted server with the id of " + serverId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
