import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";
import { beforeEach } from "node:test";

const SECRET = process.env.JWT_SECRET || "testsecret";

// different tokes to test responses

const agentToken = (agencyId = 1) =>
  jwt.sign({ role: "agent", agencyId }, SECRET, { expiresIn: "1h" });
const userToken = (userId = 1) =>
  jwt.sign({ role: "user", userId, id: userId }, SECRET, { expiresIn: "1h" });
const adminToken = (id = 1) =>
  jwt.sign({ role: "admin", id }, SECRET, { expiresIn: "1h" });

describe("GET /api/agency/me", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true });
  });

  it("returns agency profile for a valid agent token", async () => {
    const res = await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${agentToken()}`)
      .expect(200);

    expect(res.body.agency).toBeDefined();
    expect(res.body.agency.id).toBe(1);
  });

  it("401s without a token", async () => {
    const res = await request(app).get("/api/agency/me").expect(401);
    expect(res.body.error).toMatch(/no auth/i);
  });

  it("403s if role is not agent", async () => {
    await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${userToken()}`)
      .expect(403);
    await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${adminToken()}`)
      .expect(403);
  });

  it("404s if agency does not exist", async () => {
    const res = await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${agentToken(999)}`) // id that won't exist
      .expect(404);

    expect(res.body.error).toMatch(/not found/i);
  });

  it("returns expected agency fields", async () => {
    const res = await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${agentToken()}`)
      .expect(200);

    expect(res.body.agency).toEqual(
      expect.objectContaining({
        id: 1,
        agency_name: expect.any(String),
        agency_email: expect.any(String),
        phone: expect.any(String),
      })
    );
  });
});
