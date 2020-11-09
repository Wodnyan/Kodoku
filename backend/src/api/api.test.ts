import supertest from "supertest";
import app from "../app";
import { messages } from "./api";

describe("GET /api/v1", () => {
  it("should respond with a message", async () => {
    const response = await supertest(app).get("/api/v1").expect(200);
    expect(response.body.message).toEqual(messages.root);
  });
});
