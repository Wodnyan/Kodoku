import { Router } from "express";
import user from "./user/user.routes";
import auth from "./auth/auth.routes";
import server from "./server/server.routes";
import member from "./member/member.routes";
import room from "./room/room.routes";

const router = Router();
router.use("/user", user);
router.use("/auth", auth);
router.use("/server", server);
router.use("/member", member);
router.use("/room", room);

export const messages = {
  root: "Welcome to my API",
};

router.get("/", (_, res) => {
  res.json({
    message: messages.root,
  });
});

export default router;
