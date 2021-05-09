import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateSchemaAsync } from ".";

export const createServerSchema = yup.object().shape({
  name: yup.string().min(2).max(100),
  icon: yup.string().url().max(2083),
});

export const serverParamIdSchema = yup.object().shape({
  serverId: yup.number().integer().required(),
});

export const validateServerParamIdMiddleWare = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { serverId } = req.params as any;
  return validateSchemaAsync(serverParamIdSchema, { serverId })
    .then(() => {
      next();
    })
    .catch((error) => {
      next(error);
    });
};
