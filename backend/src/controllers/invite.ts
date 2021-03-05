import Invite from "../models/Invite";
import { nanoid } from "nanoid/async";

export class InviteController {
  public async create(serverId: number) {
    const inviteCode = await nanoid(10);
    const newInvite = await Invite.query().insertAndFetch({
      server_id: serverId,
      code: inviteCode,
    });
    return newInvite.code;
  }
}
