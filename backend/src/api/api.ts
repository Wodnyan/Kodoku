import { Router } from "express";
import user from "./user/user.routes";
import auth from "./auth/auth.routes";
import server from "./server/server.routes";

const router = Router();
router.use("/users", user);
router.use("/auth", auth);
router.use("/servers", server);

export const messages = {
  root: "Welcome to my API",
};

router.get("/", (_, res) => {
  res.json({
    message: messages.root,
  });
});

export default router;
