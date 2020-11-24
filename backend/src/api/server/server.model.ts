import { Model } from "objection";
import User from "../user/user.model";

export class Server extends Model {
  id!: number;
  owner_id!: number;
  name!: string;
  icon!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "servers";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "owner_id"],
      properties: {
        id: { type: "integer" },
        owner_id: { type: "number" },
        name: { type: "string", minLength: 1, maxLength: 100 },
        icon: { type: "string", maxLength: 2083 },
      },
    };
  }
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "servers.id",
        to: "users.owner_id",
      },
    },
  };
}

export default Server;
