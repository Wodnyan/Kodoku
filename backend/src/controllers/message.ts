import Message from "../models/Message";
import { MemberController } from "./member";

const memberController = new MemberController();

export class MessageController {
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

  // public async getAll(roomId: number) {}
}
