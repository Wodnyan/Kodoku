import { Model } from "objection";
import connection from "../../db";

class User extends Model {
  static get tableName() {
    return "users";
  }
}

export default User;
