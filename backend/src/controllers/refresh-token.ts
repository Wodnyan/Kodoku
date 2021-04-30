import HttpError from "../lib/exceptions/error-handler";
import { RefreshToken } from "../models/RefreshToken";

export class RefreshTokenController {
  static async blackList(token: string) {
    const isBlackListed = await RefreshTokenController.isTokenBlackListed(
      token
    );
    if (isBlackListed) {
      throw new HttpError("Already blacklisted", 409);
    }
    await RefreshToken.query().insert({
      token,
    });
  }
  static async isTokenBlackListed(token: string) {
    const refreshToken = await RefreshToken.query().findOne({
      token,
    });
    return refreshToken !== undefined;
  }
}
