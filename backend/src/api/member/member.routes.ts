import { Router } from "express";
import { protectRoute } from "../../middlewares/middlewares";
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

router.delete("/", protectRoute, deleteMember);

export default router;
