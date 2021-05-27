import { Router } from "express";
import { protectRoute } from "../../middlewares/auth";
import {
  deleteMember,
  getAllMembers,
  getOneMember,
  joinServer,
} from "./member.controller";

const router = Router({
  mergeParams: true,
});

router.get("/", getAllMembers);

router.get("/:userId", protectRoute, getOneMember);

router.post("/", protectRoute, joinServer);

router.delete("/:userId", protectRoute, deleteMember);

export default router;
