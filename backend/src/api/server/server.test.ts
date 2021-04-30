import supertest from "supertest";
import app from "../../app";
import { connection } from "../../db";

const userInfo = {
  username: "foo",
  email: "foo@bar.com",
  password: "what1234",
};

let accessToken: string;

beforeAll(async () => {
  await connection.migrate.latest();
  const user = await supertest(app)
    .post(`/api/v1/auth/register`)
    .send(userInfo);
  accessToken = user.body.accessToken;
});

afterAll(async () => {
  await connection.migrate.rollback();
  await connection.destroy();
});

afterEach(async () => {
  await connection.migrate.rollback();
  // await connection.destroy();
  await connection.migrate.latest();
  const user = await supertest(app)
    .post(`/api/v1/auth/register`)
    .send(userInfo);
  accessToken = user.body.accessToken;
});

const SERVER_ROUTE = "/api/v1/servers";

describe("Update server", () => {
  it("should respond with updated server", async () => {
    const serverInfo = {
      name: "delete",
    };
    const { body } = await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(serverInfo);
    await supertest(app)
      .put(`${SERVER_ROUTE}/${body.server.id}`)
      .send({
        name: "changed",
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
  it("should respond with 401", async () => {
    await supertest(app).put(`${SERVER_ROUTE}/1`).expect(401);
  });
});

describe("Delete server", () => {
  it("should respond with 401", async () => {
    await supertest(app).del(`${SERVER_ROUTE}/1`).expect(401);
  });
  it("should respond with 204", async () => {
    const serverInfo = {
      name: "delete",
    };
    const { body } = await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(serverInfo);
    await supertest(app)
      .del(`${SERVER_ROUTE}/${body.server.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);
  });
});

describe("Get all servers", () => {
  it("should respond with an empty array", async () => {
    const servers = await supertest(app).get(SERVER_ROUTE).expect(200);

    expect(servers.body.servers).toHaveLength(0);
  });
});

describe("Get one servers", () => {
  it("should respond with 404", async () => {
    await supertest(app).get(`${SERVER_ROUTE}/1`).expect(404);
  });

  it("should respond with 400", async () => {
    await supertest(app).get(`${SERVER_ROUTE}/foo`).expect(400);
  });

  it("should respond with a server", async () => {
    const serverInfo = {
      name: "getOne",
    };
    const createServer = await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(serverInfo)
      .expect(201);
    const server = await supertest(app)
      .get(`${SERVER_ROUTE}/${createServer.body.server.id}`)
      .expect(200);
    expect(server.body.server.name).toBe(serverInfo.name);
  });
});

describe("Create server", () => {
  it("should respond with 409", async () => {
    const conflict = {
      name: "conflict",
    };
    await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(conflict);
    await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(conflict)
      .expect(409);
  });
  it("should respond with 201", async () => {
    await supertest(app)
      .post(`${SERVER_ROUTE}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "create",
      })
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
