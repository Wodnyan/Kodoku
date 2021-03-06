import User from "../models/User";
import HttpError from "../lib/exceptions/error-handler";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} from "../lib/jwt";
import { loginSchema, registerSchema } from "../lib/validators/validate-user";
import { decryptPassword, hashPassword } from "../lib/password";
import { UserController } from "./user";
import { validateSchemaAsync } from "../lib/validators";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

interface OAuthSignUp {
  username: string;
  email: string;
  avatarUrl?: string;
}

class AuthController {
  // private readonly User.query()!: Objection.QueryBuilder<User, User[]>;

  async login(credentials: LoginCredentials) {
    await validateSchemaAsync(loginSchema, credentials);
    const user = await User.query().findOne({
      email: credentials.email,
    });
    if (!user) {
      throw new HttpError("Email not found", 401);
    }
    const dehashed = await decryptPassword(credentials.password, user.password);
    if (!dehashed) {
      throw new HttpError("Incorrect password", 401);
    }
    const accessToken = await createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);
    const userWithoutPassword = {
      ...user,
      password: undefined,
    };
    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async oAuthSignUp(credentials: OAuthSignUp) {
    const uniqueEmail = await this.isEmailUnique(credentials.email);
    if (!uniqueEmail) {
      throw new HttpError("Email is in use", 409);
    }
    const newUser = await User.query().insert({
      email: credentials.email,
      username: credentials.username,
      avatar_url: credentials.avatarUrl,
    });
    const accessToken = await createAccessToken(newUser.id);
    const refreshToken = await createRefreshToken(newUser.id);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(credentials: SignUpCredentials) {
    await validateSchemaAsync(registerSchema, credentials);
    const uniqueEmail = await this.isEmailUnique(credentials.email);
    if (!uniqueEmail) {
      throw new HttpError("Email is in use", 409);
    }
    const hashedPassword = await hashPassword(credentials.password);
    const newUser = await UserController.create({
      password: hashedPassword,
      email: credentials.email,
      username: credentials.username,
    });
    const accessToken = await createAccessToken(newUser.id);
    const refreshToken = await createRefreshToken(newUser.id);
    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  public async checkAccessToken(token: string) {
    const { userId } = (await verifyAccessToken(token)) as any;
    const user = await UserController.getOne(userId);
    return user;
  }

  private async isEmailUnique(email: string) {
    const unique = await User.query().findOne({
      email,
    });
    return unique === undefined;
  }
}

export const authController = new AuthController();
