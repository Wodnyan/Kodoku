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
      .joinRelated("members")
      .where({ "members.member_id": userId })
      .select([
        "servers.id",
        "servers.name",
        "servers.icon",
        "members.created_at as joined_at",
      ])
      .orderBy("joined_at", "asc")
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
    const newServer = await Server.transaction(async (trx) => {
      const newServer = await Server.query(trx).insertAndFetch({
        name,
        owner_id: ownerId,
        icon,
      });
      const member = await newServer.$relatedQuery<any>("members", trx).insert({
        member_id: ownerId,
        server_id: newServer.id,
      });
      return newServer;
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
