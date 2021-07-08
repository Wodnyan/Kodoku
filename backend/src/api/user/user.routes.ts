import { Router } from "express";
import { limiter } from "../../lib/rate-limiter";
import { checkUserId, protectRoute } from "../../middlewares/auth";
import {
  changeAvatar,
  changeEmail,
  changeUsername,
  getAllServersOfUser,
  getAllUsers,
} from "./user.controller";

const router = Router();
// const serverController = new ServerController();

// All Users
router.get("/", protectRoute, getAllUsers);

// Get all servers where user is member
router.get("/:userId/servers", protectRoute, getAllServersOfUser);

router.patch(
  "/:userId/avatar",
  limiter(10, 30 * 60 * 1000),
  protectRoute,
  changeAvatar,
);
router.patch("/:userId/email", protectRoute, checkUserId, changeEmail);
router.patch("/:userId/username", protectRoute, checkUserId, changeUsername);
router.patch("/:userId/password", protectRoute);

export default router;
