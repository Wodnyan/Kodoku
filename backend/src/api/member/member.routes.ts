import { Router } from "express";
import Invite from "../invite/invite.model";
import Member from "./member.model";

const router = Router();

router.get("/", async (req, res, next) => {
  const { serverId } = req.query;
  try {
    const allMembers = await Member.query()
      .joinRelated("[server, user]")
      .select(["user.username", "server.name"])
      .where({
        server_id: serverId,
      })
      .skipUndefined();
    res.json({
      members: allMembers,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { code, userId } = req.body;
    const server = await Invite.query()
      .leftJoinRelated("server")
      .select([
        "server.name",
        "server.icon",
        "invites.code",
        "server.id as server_id",
      ])
      .where({ code })
      .first();
    if (!server) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
    const newMember = await Member.query().insertAndFetch({
      member_id: userId,
      server_id: server.server_id,
    });
    res.json({
      newMember: {
        id: newMember.member_id,
      },
      joinedServer: server,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const deleted = await Member.query()
      .where({ member_id: req.params.userId })
      .delete();
    res.json({
      message: "Deleted",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
