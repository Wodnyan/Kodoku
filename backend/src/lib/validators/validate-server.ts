import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

const createServerSchema = yup.object().shape({
  name: yup.string().min(2).max(100).required(),
  ownerId: yup.number().positive().integer().required(),
  icon: yup.string().url().max(2083),
});

const serverParamIdSchema = yup.object().shape({
  serverId: yup.number().integer().required(),
});

interface Params {
  name: string;
  ownerId: number;
  icon?: string;
}

const validateServer = async (body: Params) => {
  return await createServerSchema.validate(body, { abortEarly: false });
};

export const validateServerParamId = async (serverId: number) => {
  return await serverParamIdSchema.validate(
    { serverId },
    { abortEarly: false }
  );
};

export const validateServerParamIdMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serverId } = req.params as any;
  validateServerParamId(serverId)
    .then(() => {
      next();
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400);
      }
      next(error);
    });
};

export default validateServer;
