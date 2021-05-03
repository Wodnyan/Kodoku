import HttpError from "../lib/exceptions/error-handler";
import { validateSchemaAsync } from "../lib/validators";
import { messageSchema } from "../lib/validators/validate-message";
import Member from "../models/Member";
import Message from "../models/Message";
import { UserController } from "./user";

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
    const newMessage = await Message.query().insertAndFetch({
      server_id: serverId,
      room_id: roomId,
      sender_id: userId,
      body: message,
    });
    return newMessage;
  }

  public async getAll(roomId?: number) {
    const messages = await Message.query()
      .withGraphJoined("user(selectNonCredentials)")
      .modifiers(this.modifiers)
      .select(MessageController.select)
      .where({ room_id: roomId });
    return messages;
  }
}
