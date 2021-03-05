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

const SERVER_ROUTE = "/api/v1/servers";

describe("Create server", () => {
  it("should respond with the server", async () => {
    //const user = await supertest(app).post(`${SERVER_ROUTE}/login`).expect(404);
    //const server = await supertest(app)
    //.post(`${SERVER_ROUTE}/login`)
    //.send({ yo: "yo" })
    //.expect(404);
  });
});
