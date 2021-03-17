import rateLimit from "express-rate-limit";

export const limiter = (max: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
  });
