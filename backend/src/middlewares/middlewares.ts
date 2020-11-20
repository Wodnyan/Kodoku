import { NextFunction, Response, Request } from "express";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    const error = new Error("Unauthorized");
    res.status(401);
    return next(error);
  }
  return next();
}

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    code: statusCode,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    erros: error.errors || undefined,
  });
}
