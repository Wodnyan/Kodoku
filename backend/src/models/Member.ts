import { Model } from "objection";
import path from "path";

class Member extends Model {
  id!: number;
  member_id!: number;
  server_id!: number;
  created_at!: string;
  updated_at!: string;
  static get tableName() {
    return "members";
  }
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname + "/User"),
      join: {
        from: "members.member_id",
        to: "users.id",
      },
    },
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname + "/Server"),
      join: {
        from: "members.server_id",
        to: "servers.id",
      },
    },
  };
}

export default Member;
