import { NextFunction, Request, Response } from "express";
import { ServerController } from "../../controllers/server";
import { UserController } from "../../controllers/user";
import HttpError from "../../lib/exceptions/error-handler";
import { validateSchemaAsync } from "../../lib/validators";
import { emailSchema } from "../../lib/validators/validate-user";

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

export const changeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req as any;
    const { email } = req.body;
    await validateSchemaAsync(emailSchema, { email });
    const updatedUser = await UserController.changeEmail(user.id, email);

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
  _next: NextFunction,
) => {
  const { user } = req as any;
  const { username } = req.body;
  const updatedUser = await UserController.changeUsername(user.id, username);

  return res.json({
    user: updatedUser,
  });
};
