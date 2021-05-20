import { Model, snakeCaseMappers } from "objection";
import Room from "./Room";
import User from "./User";

class Message extends Model {
  id!: number;
  senderId!: number;
  roomId!: number;
  serverId!: number;
  body!: string;
  createdAt!: string;
  updatedAt!: string;

  static get tableName() {
    return "messages";
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
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
