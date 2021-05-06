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

  static async getOneByEmail(email: string) {
    const user = await User.query()
      .where({
        email,
      })
      .first();
    return user;
  }
}
