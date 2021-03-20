import ErrorHandler from "../lib/error-handler";
import { RefreshToken } from "../models/RefreshToken";

export class RefreshTokenController {
  static async blackList(token: string) {
    const isBlackListed = await RefreshTokenController.isTokenBlackListed(
      token
    );
    console.log(isBlackListed);
    if (isBlackListed) {
      throw new ErrorHandler(409, "Already blacklisted");
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
