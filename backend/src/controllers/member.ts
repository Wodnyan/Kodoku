import HttpError from "../lib/exceptions/error-handler";
import { validateSchemaAsync } from "../lib/validators";
import { inviteSchema } from "../lib/validators/validate-invite";
import Member from "../models/Member";
import { InviteController } from "./invite";

const inviteController = new InviteController();

export class MemberController {
  static select = [
    "members.id",
    "user.username",
    "members.created_at as createdAt",
  ];

  public static async create(
    serverId: number,
    userId: number,
    inviteCode: string,
  ) {
    await validateSchemaAsync(inviteSchema, {
      inviteCode,
    });
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
        is_owner: true,
      });
      return {
        id: newMember.id,
        serverId: newMember.server_id,
        userId: newMember.member_id,
      };
    }
  }

  public static async getAll(serverId?: number) {
    const allMembers = await Member.query()
      .where({ server_id: serverId })
      .joinRelated("user")
      .select(MemberController.select)
      .skipUndefined();
    return allMembers;
  }

  public static async getOne(serverId: number, userId: number) {
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

  public static async delete(serverId: number, userId: number) {
    const isOwner = await this.isOwner(serverId, userId);
    if (!isOwner) {
      throw new HttpError("Not the owner", 401);
    }
    return await Member.query()
      .where({
        member_id: userId,
        server_id: serverId,
      })
      .delete();
  }

  private static async isOwner(serverId: number, userId: number) {
    return Boolean(
      Member.query().where({
        member_id: userId,
        server_id: serverId,
        is_owner: true,
      }),
    );
  }

  private static async isAlreadyMember(serverId: number, userId: number) {
    const member = await Member.query().findOne({
      member_id: userId,
      server_id: serverId,
    });
    return member !== undefined;
  }
}
