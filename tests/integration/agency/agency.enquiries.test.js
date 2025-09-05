import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

const SECRET = process.env.JWT_SECRET || "testsecret";

// token helpers
const agentToken = (agencyId = 1) =>
  jwt.sign({ role: "agent", agencyId }, SECRET, { expiresIn: "1h" });

const userToken = (userId = 1) =>
  jwt.sign({ role: "user", userId, id: userId }, SECRET, { expiresIn: "1h" });

const adminToken = (id = 1) =>
  jwt.sign({ role: "admin", id }, SECRET, { expiresIn: "1h" });

describe("GET /api/agency.enquiries", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true });
  });
  it("200: agent can fetch only their own enquiries", async () => {
    const agencyId = 1;
    const res = await request(app)
      .get(`/api/agency/${agencyId}/enquiries`)
      .set("Authorization", `Bearer ${agentToken()}`)
      .expect(200);

    const list = res.body.data ?? [];
    expect(Array.isArray(list)).toBe(true);

    list.forEach((e) => {
      expect(e).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          property_id: expect.any(Number),
          message: expect.any(String),
        })
      );
    });
  });

  it("403: non-agents blocked", async () => {
    await request(app)
      .get(`/api/agency/1/enquiries`)
      .set("Authorization", `Bearer ${userToken()}`)
      .expect(403);
  });

  it("401: missing token", async () => {
    await request(app).get(`/api/agency/1/enquiries`).expect(401);
  });

  it("403: agent cannot fetch another agency’s enquiries", async () => {
    await request(app)
      .get(`/api/agency/2/enquiries`)
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .expect(403);
  });

  it("200: admin can fetch any agency’s enquiries", async () => {
    const res = await request(app)
      .get(`/api/agency/1/enquiries`)
      .set("Authorization", `Bearer ${adminToken()}`)
      .expect(200);

    expect(Array.isArray(res.body.data ?? [])).toBe(true);
  });

  it("200: respects pagination (limit & page)", async () => {
    const agencyId = 1;
    const res = await request(app)
      .get(`/api/agency/${agencyId}/enquiries?limit=1&page=1`)
      .set("Authorization", `Bearer ${agentToken(agencyId)}`)
      .expect(200);

    expect(res.body.limit).toBe(1);
    expect(res.body.page).toBe(1);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(typeof res.body.totalCount).toBe("number");
  });
});
