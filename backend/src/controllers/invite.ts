import Invite from "../models/Invite";
import { nanoid } from "nanoid/async";
import Member from "../models/Member";
import HttpError from "../lib/exceptions/error-handler";

export class InviteController {
  public async create(serverId: number, userId: number) {
    const isMember = await Member.query().findOne({
      member_id: userId,
    });
    if (!isMember) {
      throw new HttpError("Not a member", 401);
    }
    const inviteCode = await nanoid(10);
    const newInvite = await Invite.query().insertAndFetch({
      server_id: serverId,
      code: inviteCode,
    });
    return newInvite.code;
  }

  public async getOne(serverId: number, inviteCode: string) {
    const code = await Invite.query().findOne({
      server_id: serverId,
      code: inviteCode,
    });
    return code;
  }
}
