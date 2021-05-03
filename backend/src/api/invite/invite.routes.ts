import { Router } from "express";
import { protectRoute } from "../../middlewares/middlewares";
import { createInvite } from "./invite.controller";

const router = Router({
  mergeParams: true,
});

router.get("/", protectRoute, createInvite);

export default router;
