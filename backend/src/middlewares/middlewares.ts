import { NextFunction, Response, Request } from "express";
import { AuthController } from "../controllers/auth";
import ErrorHandler from "../lib/error-handler";

const authController = new AuthController();

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1];
    const user = await authController.checkAccessToken(token!);
    req.user = user;
    next();
  } catch (error) {
    next();
  }
}

export async function protectRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    next(new ErrorHandler(401, "Unauthorized"));
  } else {
    next();
  }
}

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (error.statusCode) {
    statusCode = error.statusCode;
  }
  if (error.name === "ValidationError") {
    statusCode = 400;
  }
  res.status(statusCode);
  res.json({
    message: error.message,
    code: statusCode,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    errors: error.errors || undefined,
  });
}
