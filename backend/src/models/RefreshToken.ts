import { Model } from "objection";

export class RefreshToken extends Model {
  id!: number;
  token!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "black_listed_refresh_tokens";
  }
}
