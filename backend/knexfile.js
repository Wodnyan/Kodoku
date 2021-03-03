require("dotenv").config();

module.exports = {
  test: {
    client: "pg",
    connection: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_TEST_DB,
    },
  },
  development: {
    client: "pg",
    connection: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
  },
};
