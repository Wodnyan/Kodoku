import rateLimit from "express-rate-limit";

// Default timeout is 15 minutes
export const limiter = (max: number, amountInMs: number = 15 * 60 * 1000) =>
  rateLimit({
    windowMs: amountInMs,
    max,
  });
