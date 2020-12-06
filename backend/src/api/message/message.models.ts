import { Model } from "objection";
import Room from "../room/room.model";
import User from "../user/user.model";

class Message extends Model {
  id!: number;
  sender_id!: number;
  room_id!: number;
  body!: string;
  created_at!: string;
  updated_at!: string;
  static get tableName() {
    return "messages";
  }
  static relationMappings = {
    room: {
      relation: Model.BelongsToOneRelation,
      modelClass: Room,
      join: {
        from: "messages.room_id",
        to: "rooms.id",
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "messages.sender_id",
        to: "users.id",
      },
    },
  };
}

export default Message;
