import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app.js";

describe("App Integration", () => {
  it("should return 200 on health check", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });
  it("should return 404 on the incorrect request", async () => {
    const endpoint = "/Error";
    const response = await request(app).get(endpoint);
    expect(response.status).toBe(404);
    expect(response.text).include(`Cannot GET ${endpoint}`);
  });
});
