import HttpError from "../lib/error-handler";
import Member from "../models/Member";
import { InviteController } from "./invite";

const inviteController = new InviteController();

export class MemberController {
  static select = [
    "members.id",
    "user.username",
    "members.created_at as createdAt",
  ];

  public async create(serverId: number, userId: number, inviteCode: string) {
    const isAlreadyMember = await this.isAlreadyMember(serverId, userId);
    if (isAlreadyMember) {
      throw new HttpError("User is already a member", 409);
    }
    const invite = await inviteController.getOne(serverId, inviteCode);
    if (!invite) {
      throw new HttpError("No invite code found", 404);
    } else {
      const newMember = await Member.query().insertAndFetch({
        member_id: userId,
        server_id: serverId,
      });
      return {
        id: newMember.id,
        serverId: newMember.server_id,
      };
    }
  }

  public async getAll(serverId?: number) {
    const allMembers = await Member.query()
      .where({ server_id: serverId })
      .joinRelated("user")
      .select(MemberController.select)
      .skipUndefined();
    return allMembers;
  }

  public async getOne(serverId: number, userId: number) {
    const member = await Member.query()
      .findOne({
        member_id: userId,
        server_id: serverId,
      })
      .joinRelated("user")
      .select(MemberController.select);
    if (member === undefined) {
      throw new HttpError("No member found", 404);
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
