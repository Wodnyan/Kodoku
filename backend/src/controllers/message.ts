import Message from "../models/Message";
import { MemberController } from "./member";
import { UserController } from "./user";

const memberController = new MemberController();

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
    message: string
  ) {
    const member = await memberController.getOne(serverId, userId);
    const newMessage = await Message.query().insertAndFetch({
      room_id: roomId,
      sender_id: member.id,
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
