import supertest from "supertest";
import app from "../../app";
import { connection } from "../../db";

beforeAll(async () => {
  await connection.migrate.latest();
});

afterAll(async () => {
  await connection.migrate.rollback();
  await connection.destroy();
});

const AUTH_ROUTE = "/api/v1/auth";

const user = {
  username: "test",
  email: "test@test.com",
  password: "testPassword123",
};

const invalidUser = {
  username: "1",
  email: "test",
  password: "foo",
};

describe("Register User", () => {
  const jwtRegex = "[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.[A-Za-z0-9-_.+/=]*";
  const cookieJWTRegex = `^refresh_token=${jwtRegex};$`;

  it("should respond with an access token and a refresh token", async () => {
    const response = await supertest(app)
      .post(`${AUTH_ROUTE}/register`)
      .send(user)
      .expect(201);
    const cookie = response.headers["set-cookie"][0].split(" ");

    expect(response.body.accessToken).toMatch(new RegExp(jwtRegex));

    expect(cookie[0]).toMatch(new RegExp(cookieJWTRegex));
    expect(cookie[2]).toEqual("HttpOnly");
  });

  it("should respond with 409 Conflict", async () => {
    await supertest(app).post(`${AUTH_ROUTE}/register`).send(user).expect(409);
  });

  it("should respond with 400 Bad Request", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/register`)
      .send(invalidUser)
      .expect(400);
  });
});
