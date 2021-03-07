import { Model } from "objection";
import Message from "./Message";
import Server from "./Server";

class Room extends Model {
  id!: number;
  server_id!: number;
  name!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "rooms";
  }
  static relationMappings = {
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: Server,
      join: {
        from: "rooms.server_id",
        to: "servers.id",
      },
    },
    messages: {
      relation: Model.HasManyRelation,
      modelClass: Message,
      join: {
        from: "rooms.id",
        to: "messages.sender_id",
      },
    },
  };
}
export default Room;
