import { Model } from "objection";
import connection from "../../db";

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
  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return "users";
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
