import knex from "knex";
import { Model } from "objection";
const config = require("../knexfile");

const environment = process.env.NODE_ENV || "development";

export const connection = knex(config[environment]);

export default function makeConnection() {
  Model.knex(connection);
}
