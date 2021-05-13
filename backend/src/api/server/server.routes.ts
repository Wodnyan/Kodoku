import { Router } from "express";
import { protectRoute } from "../../middlewares/auth";
import members from "../member/member.routes";
import invites from "../invite/invite.routes";
import rooms from "../room/room.routes";
import { validateServerParamIdMiddleWare } from "../../lib/validators/validate-server";
import {
  createServer,
  deleteServer,
  getAllServers,
  getOneServer,
  updateServer,
} from "./server.controller";
import multer from "multer";
import path from "path";
import HttpError from "../../lib/exceptions/error-handler";
import { limiter } from "../../lib/rate-limiter";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    files: 1,
    // 1 mb
    fileSize: 1e6,
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      const error = new HttpError("File needs to be an image", 400);
      return cb(error);
    }
    // File name: <fieldname>-<timeStamp>.<fileType>
    file.filename = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname,
    )}`;
    cb(null, true);
  },
});

const router = Router();

router.get("/", getAllServers);

router.post("/", protectRoute, createServer);

router.get("/:serverId", validateServerParamIdMiddleWare, getOneServer);

router.put(
  "/:serverId/icon",
  // 30 minutes timeout
  limiter(10, 30 * 60 * 1000),
  validateServerParamIdMiddleWare,
  protectRoute,
  upload.single("icon"),
  updateServer,
);

router.delete(
  "/:serverId",
  validateServerParamIdMiddleWare,
  protectRoute,
  deleteServer,
);

// Check if server id is an integer
router.use("/:serverId", validateServerParamIdMiddleWare);
router.use("/:serverId/members", validateServerParamIdMiddleWare, members);
router.use("/:serverId/invites", validateServerParamIdMiddleWare, invites);
router.use("/:serverId/rooms", validateServerParamIdMiddleWare, rooms);

export default router;
