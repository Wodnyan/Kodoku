const tableNames = {
  users: "users",
  servers: "servers",
  rooms: "rooms",
  messages: "messages",
};

function references(table, name, tableName) {
  table
    .integer(name)
    .unsigned()
    .references("id")
    .inTable(tableName)
    .onDelete("cascade")
    .notNullable();
}

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.users, (table) => {
    table.increments();
    table.string("username", 100).notNullable();
    table.string("password", 100);
    table.string("email").unique();
    table.string("profile_picture", 2083);
    table.timestamps(false, true);
  });
  await knex.schema.createTable(tableNames.servers, (table) => {
    table.increments();
    references(table, "owner_id", tableNames.users);
    table.string("name", 100);
    table.string("icon", 2083);
  });
  await knex.schema.createTable(tableNames.rooms, (table) => {
    table.increments();
    references(table, "server_id", tableNames.servers);
    table.string("name", 100);
  });
  await knex.schema.createTable(tableNames.messages, (table) => {
    table.increments();
    references(table, "sender_id", tableNames.users);
    references(table, "room_id", tableNames.rooms);
    table.string("body");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableNames.messages);
  await knex.schema.dropTableIfExists(tableNames.rooms);
  await knex.schema.dropTableIfExists(tableNames.servers);
  await knex.schema.dropTableIfExists(tableNames.users);
};
