import { Router } from "express";
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
    const { userId, serverId } = req.body;
    const newMember = await Member.query().insertAndFetch({
      member_id: userId,
      server_id: serverId,
    });
    res.json({
      newMember,
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
