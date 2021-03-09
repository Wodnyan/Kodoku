import User from "../models/User";

export class UserController {
  static readonly nonCredentials: string[] = [
    "id",
    "username",
    "email",
    "avatar_url as avatarUrl",
    "created_at as createdAt",
  ];

  public async getOne(id: number) {
    const user = await User.query()
      .findById(id)
      .select(UserController.nonCredentials);
    return user;
  }
}
