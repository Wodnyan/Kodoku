import { NextFunction, Request, Response } from "express";
import { ServerController } from "../../controllers/server";
import { UserController } from "../../controllers/user";

export const getAllUsers = (req: Request, res: Response) => {
  const user = req.user;
  res.json({
    user,
    message: "User",
  });
};

export const getAllServersOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const servers = await ServerController.getAll(Number(userId));
    res.json({
      servers,
    });
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = (
  _req: Request,
  _res: Response,
  _next: NextFunction,
) => {};

export const changeEmail = (
  _req: Request,
  _res: Response,
  _next: NextFunction,
) => {};

export const changeUsername = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { user } = req as any;
  const { username } = req.body;
  const updatedUser = await UserController.changeUsername(user.id, username);

  return res.json({
    user: {
      ...updatedUser,
      password: undefined,
    },
  });
};
