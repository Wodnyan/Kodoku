import { Router } from "express";
import validateServer from "../../lib/validate-server";
import Server from "../server/server.model";

const router = Router();

interface Update {
  name?: string;
  icon?: string;
}

router.get("/", async (req, res, next) => {
  const { userId } = req.query;
  try {
    const servers = await Server.query()
      .where({ owner_id: userId })
      .skipUndefined();
    res.json({
      message: "All Servers",
      servers,
      userId,
    });
  } catch (error) {
    if (error.nativeError.code === "22P02") {
      const error = new Error("Invalid parameter value");
      res.status(400);
      return next(error);
    }
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
