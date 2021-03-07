import ErrorHandler from "../lib/error-handler";
import Member from "../models/Member";
import { InviteController } from "./invite";

const inviteController = new InviteController();

export class MemberController {
  public async create(serverId: number, userId: number, inviteCode: string) {
    const isAlreadyMember = await this.isAlreadyMember(serverId, userId);
    if (isAlreadyMember) {
      throw new ErrorHandler(409, "User is already a member");
    }
    const invite = await inviteController.getOne(serverId, inviteCode);
    if (!invite) {
      throw new ErrorHandler(404, "No invite code found");
    } else {
      const newMember = await Member.query().insertAndFetch({
        member_id: userId,
        server_id: serverId,
      });
      return newMember;
    }
  }

  public async getAll(serverId?: number) {
    const allMembers = await Member.query().where({ server_id: serverId });
    return allMembers;
  }

  public async getOne(serverId: number, userId: number) {
    const member = await Member.query().findOne({
      member_id: userId,
      server_id: serverId,
    });
    if (member === undefined) {
      throw new ErrorHandler(404, "No member found");
    }
    return member;
  }

  public async delete(serverId: number, userId: number) {
    return await Member.query()
      .where({
        member_id: userId,
        server_id: serverId,
      })
      .delete();
  }

  private async isAlreadyMember(serverId: number, userId: number) {
    const member = await Member.query().findOne({
      member_id: userId,
      server_id: serverId,
    });
    return member !== undefined;
  }
}
