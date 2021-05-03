import { Request, Response, NextFunction } from "express";
import { InviteController } from "../../controllers/invite";

export const createInvite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { serverId } = req.params;
    const { id: userId } = req.user as any;
    const inviteCode = await InviteController.create(Number(serverId), userId);
    return res.status(201).json({
      inviteCode,
    });
  } catch (error) {
    next(error);
  }
};
