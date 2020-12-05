import { Router } from "express";
import user from "./user/user.routes";
import auth from "./auth/auth.routes";
import server from "./server/server.routes";
import member from "./member/member.routes";
import room from "./room/room.routes";
import invite from "./invite/invite.routes";

const router = Router();
router.use("/users", user);
router.use("/auth", auth);
router.use("/servers", server);
router.use("/members", member);
router.use("/rooms", room);
router.use("/invites", invite);

export const messages = {
  root: "Welcome to my API",
};

router.get("/", (_, res) => {
  res.json({
    message: messages.root,
  });
});

export default router;
