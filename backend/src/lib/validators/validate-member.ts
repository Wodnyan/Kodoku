import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

// const createInviteSchema = yup.object().shape({
//   inviteCode: yup.string().max(10).required(),
//   userId: yup.number().integer().required(),
// });
//
// interface Invite {
//   inviteCode: string;
//   userId: number;
// }
//
// export const validateJoinServer = async (invite: Invite) => {
//   return await createInviteSchema.validate(invite, {
//     abortEarly: false,
//   });
// };
//
// export const validateJoinServerMiddleware = async (
//   req: Request,
//   _res: Response,
//   next: NextFunction
// ) => {
//   validateJoinServer(req.body)
//     .then(() => {
//       next();
//     })
//     .catch((error) => {
//       next(error);
//     });
// };
