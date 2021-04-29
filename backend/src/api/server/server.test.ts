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

const server = {
  name: "foobar",
};

const userInfo = {
  username: "foo",
  email: "foo@bar.com",
  password: "what1234",
};

let accessToken: string;

const SERVER_ROUTE = "/api/v1/servers";

describe("Create server", () => {
  it("should respond with 201", async () => {
    // Create a user
    const user = await supertest(app)
      .post(`/api/v1/auth/register`)
      .send(userInfo);
    accessToken = user.body.accessToken;
    await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(server)
      .expect(201);
  });

  it("should respond with 401", async () => {
    await supertest(app).post(`${SERVER_ROUTE}`).expect(401);
  });

  it("should respond with 400", async () => {
    await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
      .expect(400);
  });
});
