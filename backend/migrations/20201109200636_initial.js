const tableNames = {
  users: "users",
  servers: "servers",
  rooms: "rooms",
  messages: "messages",
  members: "members",
  provider: "provider",
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
  // USERS
  await knex.schema.createTable(tableNames.users, (table) => {
    table.increments();
    table.string("username", 30).notNullable();
    table.string("password", 100);
    table.string("email").unique().notNullable();
    table.string("avatar_url", 2083);
    table.timestamps(false, true);
  });
  // PROVIDER
  await knex.schema.createTable(tableNames.provider, (table) => {
    table.increments();
    table.integer("provider_id").notNullable();
    table.string("provider").notNullable();
    table.unique(["provider", "provider_id"]);
    references(table, "user_id", tableNames.users);
  });
  // SERVERS
  await knex.schema.createTable(tableNames.servers, (table) => {
    table.increments();
    references(table, "owner_id", tableNames.users);
    table.string("name", 100).notNullable();
    table
      .string("icon", 2083)
      .defaultTo(
        "https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg"
      );
    table.timestamps(false, true);
  });
  // ROOMS
  await knex.schema.createTable(tableNames.rooms, (table) => {
    table.increments();
    references(table, "server_id", tableNames.servers);
    table.string("name", 100).notNullable();
    table.timestamps(false, true);
  });
  // MESSAGES
  await knex.schema.createTable(tableNames.messages, (table) => {
    table.increments();
    references(table, "sender_id", tableNames.users);
    references(table, "room_id", tableNames.rooms);
    table.string("body").notNullable();
    table.timestamps(false, true);
  });
  // MEMBERS
  await knex.schema.createTable(tableNames.members, (table) => {
    table.increments();
    references(table, "member_id", tableNames.users);
    references(table, "server_id", tableNames.servers);
    table.unique(["member_id", "server_id"]);
    table.timestamps(false, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableNames.provider);
  await knex.schema.dropTableIfExists(tableNames.members);
  await knex.schema.dropTableIfExists(tableNames.messages);
  await knex.schema.dropTableIfExists(tableNames.rooms);
  await knex.schema.dropTableIfExists(tableNames.servers);
  await knex.schema.dropTableIfExists(tableNames.users);
};
