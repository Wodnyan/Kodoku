import User from "../models/User";

type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
};

export class UserController {
  static readonly nonCredentials: string[] = [
    "id",
    "username",
    "email",
    "avatar_url as avatarUrl",
    "created_at as createdAt",
  ];

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

  static async changeAvatar() {
    throw new Error("NOT IMPLEMENTED");
  }

  static async changeEmail(userId: number, newEmail: string) {
    await User.query()
      .patch({
        email: newEmail,
      })
      .findById(userId);
    const user = await UserController.getOne(userId);
    return user;
  }

  static async changeUsername(userId: number, newUsername: string) {
    await User.query()
      .patch({
        username: newUsername,
      })
      .findById(userId);
    const user = await UserController.getOne(userId);
    return user;
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
