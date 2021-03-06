import HttpError from "../lib/exceptions/error-handler";
import { validateSchemaAsync } from "../lib/validators";
import { messageSchema } from "../lib/validators/validate-message";
import { defaultQueryParamOptions } from "../lib/validators/validate-query-param-options";
import Member from "../models/Member";
import Message from "../models/Message";
import { UserController } from "./user";

type Options = {
  offset?: number;
  limit?: number;
  orderBy?: "asc" | "desc";
};

export class MessageController {
  private readonly modifiers = {
    selectNonCredentials(builder: any) {
      builder.select(...UserController.nonCredentials);
    },
  };
  static select = ["messages.id", "body", "messages.created_at as createdAt"];

  public async create(
    serverId: number,
    roomId: number,
    userId: number,
    message: string,
  ) {
    // Check if user is a member of the server
    const isMember = await Member.query()
      .where({
        member_id: userId,
        server_id: serverId,
      })
      .first();
    if (!isMember) {
      throw new HttpError("Not a member", 401);
    }
    await validateSchemaAsync(messageSchema, {
      message,
    });
    const newMessage = await Message.query()
      .insert({
        serverId: serverId,
        roomId: roomId,
        senderId: userId,
        body: message,
      })
      .returning("*")
      .withGraphFetched("user(selectNonCredentials)")
      .modifiers(this.modifiers);
    return newMessage;
  }

  public async getAll(roomId?: number, options?: Options) {
    await validateSchemaAsync(defaultQueryParamOptions, options);
    const messages = await Message.query()
      .withGraphJoined("user(selectNonCredentials)")
      .modifiers(this.modifiers)
      .select(MessageController.select)
      .orderBy("created_at", options?.orderBy || "asc")
      .limit(Number(options?.limit))
      .offset(Number(options?.offset))
      .where({ room_id: roomId });
    return messages;
  }
}
