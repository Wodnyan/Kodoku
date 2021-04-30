import supertest from "supertest";
import app from "../../app";
import { jwtRegex } from "../../constants";
import { connection } from "../../db";

beforeAll(async () => {
  await connection.migrate.latest();
});

afterAll(async () => {
  await connection.migrate.rollback();
  await connection.destroy();
});

const AUTH_ROUTE = "/api/v1/auth";
const cookieJWTRegex = `^refresh_token=${jwtRegex};$`;

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

describe("Login User", () => {
  const wrongPassword = {
    ...user,
    password: "wrong-password",
  };

  const noEmailFound = {
    ...user,
    email: "foo@bar.com",
  };

  it("should respond with an access token and a refresh token", async () => {
    const response = await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send(user)
      .expect(200);
    const cookie = response.headers["set-cookie"][0].split(" ");

    expect(response.body.accessToken).toMatch(new RegExp(jwtRegex));

    expect(cookie[0]).toMatch(new RegExp(cookieJWTRegex));
    expect(cookie[2]).toEqual("HttpOnly");
  });

  it("should respond with 401 Unauthorized", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send(wrongPassword)
      .expect(401);
  });

  it("should respond with 404 Not Found", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send(noEmailFound)
      .expect(404);
  });

  it("should respond with 400 Bad Request", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send(invalidUser)
      .expect(400);
  });
});
