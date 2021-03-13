import { Model } from "objection";
import Member from "./Member";
import Room from "./Room";
import User from "./User";

class Message extends Model {
  id!: number;
  sender_id!: number;
  room_id!: number;
  body!: string;
  created_at!: string;
  updated_at!: string;
  // messages.sender_id -> member.id -> member.member_id -> users.id
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
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: "messages.sender_id",
        to: "users.id",
      },
    },
  };
}

export default Message;
