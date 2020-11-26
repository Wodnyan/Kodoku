import { Model } from "objection";
import Server from "../server/server.model";

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
  };
}
export default Room;
