import Objection from "objection";
import User from "../models/User";
import ErrorHandler from "../lib/error-handler";
import { createAccessToken, createRefreshToken } from "../lib/jwt";
import registerCredentialsValidator from "../lib/validate-user";
import { hashPassword } from "../lib/password";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export class AuthController {
  private readonly query!: Objection.QueryBuilder<User, User[]>;

  constructor() {
    this.query = User.query();
  }

  // login(credentials: LoginCredentials) {}

  async signUp(credentials: SignUpCredentials) {
    await registerCredentialsValidator(credentials);
    const uniqueEmail = await this.isEmailUnique(credentials.email);
    if (!uniqueEmail) {
      throw new ErrorHandler(409, "Email is in use");
    }
    const hashedPassword = await hashPassword(credentials.password);
    const newUser = await this.query.insert({
      password: hashedPassword,
      email: credentials.email,
      username: credentials.username,
    });
    const accessToken = await createAccessToken(newUser.id);
    const refreshToken = await createRefreshToken(newUser.id);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async isEmailUnique(email: string) {
    const unique = await this.query.findOne({
      email,
    });
    return unique === undefined;
  }
}
