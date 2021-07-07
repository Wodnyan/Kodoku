import { Router } from "express";
import { checkUserId, protectRoute } from "../../middlewares/auth";
import {
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

router.patch("/:userId/avatar", protectRoute);
router.patch("/:userId/email", protectRoute, checkUserId, changeEmail);
router.patch("/:userId/username", protectRoute, checkUserId, changeUsername);
router.patch("/:userId/password", protectRoute);

export default router;
