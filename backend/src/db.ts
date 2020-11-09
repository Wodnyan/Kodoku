import knex from "knex";
import { Model } from "objection";
const config = require("../knexfile");

const environment = process.env.NODE_ENV || "development";

const connection = knex(config[environment]);

Model.knex(connection);

export default connection;
