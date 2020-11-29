import { Model } from "objection";
import Server from "../server/server.model";

class Invite extends Model {
  id!: number;
  server_id!: number;
  code!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "invites";
  }

  static relationMappings = {
    server: {
      modelClass: Server,
      relation: Model.BelongsToOneRelation,
      join: {
        from: "invites.server_id",
        to: "servers.id",
      },
    },
  };
}
export default Invite;
