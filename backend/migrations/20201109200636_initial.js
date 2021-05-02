const tableNames = {
  users: "users",
  servers: "servers",
  rooms: "rooms",
  messages: "messages",
  members: "members",
  provider: "provider",
  invites: "invites",
  blackListedRefreshTokens: "black_listed_refresh_tokens",
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
  // SERVERS
  await knex.schema.createTable(tableNames.servers, (table) => {
    table.increments();
    references(table, "owner_id", tableNames.users);
    table.string("name", 100).unique().notNullable();
    table
      .string("icon", 2083)
      .defaultTo(
        "https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg",
      );
    table.timestamps(false, true);
  });
  // ROOMS
  await knex.schema.createTable(tableNames.rooms, (table) => {
    table.increments();
    references(table, "server_id", tableNames.servers);
    table.string("name", 100).notNullable();
    table.timestamps(false, true);
    table.unique(["name", "server_id"]);
  });
  // MEMBERS
  await knex.schema.createTable(tableNames.members, (table) => {
    table.increments();
    table.boolean("is_owner").defaultTo(false).notNullable();
    references(table, "member_id", tableNames.users);
    references(table, "server_id", tableNames.servers);
    table.unique(["member_id", "server_id"]);
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
  // INVITES
  await knex.schema.createTable(tableNames.invites, (table) => {
    table.increments();
    references(table, "server_id", tableNames.servers);
    table.string("code", 10).unique().notNullable();
    table.timestamps(false, true);
  });
  // BLACK LISTED REFRESH TOKEN
  await knex.schema.createTable(
    tableNames.blackListedRefreshTokens,
    (table) => {
      table.increments();
      table.string("token", 343).unique().notNullable();
      table.timestamps(false, true);
    },
  );
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableNames.invites);
  await knex.schema.dropTableIfExists(tableNames.provider);
  await knex.schema.dropTableIfExists(tableNames.messages);
  await knex.schema.dropTableIfExists(tableNames.members);
  await knex.schema.dropTableIfExists(tableNames.rooms);
  await knex.schema.dropTableIfExists(tableNames.servers);
  await knex.schema.dropTableIfExists(tableNames.users);
  await knex.schema.dropTableIfExists(tableNames.blackListedRefreshTokens);
};
