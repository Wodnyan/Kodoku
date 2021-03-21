import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createRefreshToken = async (userId: number) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "1d",
      },
      (error: any, jwt: any) => {
        if (error) reject(error);
        resolve(jwt);
      }
    );
  });
};

export const createAccessToken = async (userId: number) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      },
      (error: any, jwt: any) => {
        if (error) reject(error);
        resolve(jwt);
      }
    );
  });
};

export const verifyRefreshToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
};

export const verifyAccessToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
};
