import { Router } from "express";
import randomString from "../../lib/random-string";
import Invite from "./invite.model";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const invites = await Invite.query();
    res.json({
      message: "Invites",
      invites,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { serverId } = req.body;
    const code = randomString();
    const newInvite = await Invite.query().insertAndFetch({
      server_id: serverId,
      code,
    });
    res.status(201).json({
      message: "New invite",
      newInvite,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
