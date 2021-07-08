import HttpError from "../lib/exceptions/error-handler";
import { decryptPassword } from "../lib/password";
import User from "../models/User";

type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
};

export class UserController {
  static readonly select: string[] = [
    "id",
    "username",
    "email",
    "avatar_url as avatarUrl",
    "created_at as createdAt",
    "password",
  ];
  static readonly nonCredentials: string[] = UserController.select.filter(
    (value) => value !== "password",
  );

  static async getOne(id: number) {
    const user = await User.query()
      .findById(id)
      .select(UserController.nonCredentials);
    return user;
  }

  static async create(payload: CreateUserPayload) {
    const {
      id,
      avatar_url,
      created_at,
      username,
      email,
    } = await User.query().insertAndFetch(payload);
    return {
      id,
      username,
      email,
      createdAt: created_at,
      avatarUrl: avatar_url,
    };
  }

  static async changeAvatar(userId: number, newAvatar: string) {
    await User.query()
      .patch({
        avatar_url: newAvatar,
      })
      .findById(userId);
    const user = await UserController.getOne(userId);
    return user;
  }

  static async changeEmail(userId: number, newEmail: string, password: string) {
    await User.query()
      .patch({
        email: newEmail,
      })
      .findById(userId);
    const user = await User.query()
      .where({
        id: userId,
      })
      .select(UserController.select)
      .first();
    const isMatching = await decryptPassword(password, user.password);
    if (!isMatching) {
      throw new HttpError("Incorrect password", 401);
    }
    return {
      ...user,
      password: undefined,
    };
  }

  // TODO: Add verify password
  static async changeUsername(
    userId: number,
    newUsername: string,
    password: string,
  ) {
    await User.query()
      .patch({
        username: newUsername,
      })
      .findById(userId);
    const user = await User.query()
      .where({
        id: userId,
      })
      .select(UserController.select)
      .first();
    const isMatching = await decryptPassword(password, user.password);
    if (!isMatching) {
      throw new HttpError("Incorrect password", 401);
    }
    return {
      ...user,
      password: undefined,
    };
  }

  static async changePassword() {
    throw new Error("NOT IMPLEMENTED");
  }

  static async getOneByEmail(email: string) {
    const user = await User.query()
      .where({
        email,
      })
      .first();
    return user;
  }
}
