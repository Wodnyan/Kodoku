import { NextFunction, Request, Response } from "express";
import { ServerController } from "../../controllers/server";
import { UserController } from "../../controllers/user";
import HttpError from "../../lib/exceptions/error-handler";
import { uploadFile } from "../../lib/upload-file";
import { validateSchemaAsync } from "../../lib/validators";
import {
  changeEmailSchema,
  changeUsernameSchema,
} from "../../lib/validators/validate-user";

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

export const changeAvatar = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { user } = req as any;
  const avatar = (await uploadFile(
    req.file.buffer,
    `user-avatars/${req.file.filename}`,
  )) as any;
  const updatedUser = await UserController.changeAvatar(user.id, avatar);
  return res.json({
    user: updatedUser,
  });
};

export const changeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req as any;
    const { email, password } = req.body;
    await validateSchemaAsync(changeEmailSchema, { email, password });
    const updatedUser = await UserController.changeEmail(
      user.id,
      email,
      password,
    );

    return res.json({
      user: updatedUser,
    });
  } catch (error) {
    if (error.constraint === "users_email_unique") {
      next(new HttpError("Email is in use.", 409));
    }
    next(error);
  }
};

export const changeUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req as any;
    const { username, password } = req.body;
    await validateSchemaAsync(changeUsernameSchema, {
      username,
      password,
    });

    const updatedUser = await UserController.changeUsername(
      user.id,
      username,
      password,
    );

    return res.json({
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
