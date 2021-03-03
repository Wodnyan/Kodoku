import { Model } from "objection";

export class Provider extends Model {
  provider_id!: number;
  user_id!: number;
  provider!: "github" | "local";
  static get tableName() {
    return "provider";
  }
}

class User extends Model {
  id!: number;
  username!: string;
  password!: string;
  email!: string;
  avatar_url!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "users";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "email"],
      properties: {
        id: { type: "integer" },
        username: { type: "string" },
        email: { type: "string", maxLength: 255 },
        avatar_url: { type: "string", maxLength: 2083 },
      },
    };
  }
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static relationMappings = {
    provider: {
      relation: Model.BelongsToOneRelation,
      modelClass: Provider,
      join: {
        from: "provider.user_id",
        to: "users.id",
      },
    },
  };
}

export default User;
