import ErrorHandler from "../lib/error-handler";
import User from "../models/User";

export class UserController {
  private select: string[] = [
    "id",
    "username",
    "email",
    "avatar_url as avatarUrl",
    "created_at as createdAt",
  ];

  public async getOne(id: number) {
    const user = await User.query().findById(id);
    return user;
  }
}
