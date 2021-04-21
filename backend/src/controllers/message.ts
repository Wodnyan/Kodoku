import Message from "../models/Message";
import { UserController } from "./user";

export class MessageController {
  private readonly modifiers = {
    selectNonCredentials(builder: any) {
      builder.select(...UserController.nonCredentials);
    },
  };
  static select = ["messages.id", "body", "messages.created_at as createdAt"];
  public async create(roomId: number, userId: number, message: string) {
    const newMessage = await Message.query().insertAndFetch({
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
