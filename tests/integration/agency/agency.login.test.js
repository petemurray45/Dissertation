import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

const SECRET = process.env.JWT_SECRET || "testsecret";

const adminToken = (id = 1) =>
  jwt.sign({ role: "admin", id }, SECRET, { expiresIn: "1h" });

describe("POST /api/agency/login", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true });
  });

  it("200: logs in seeded agency and returns token", async () => {
    const res = await request(app)
      .post("/api/agency/agencylogin")
      .send({ agency_name: "Test Agency", loginId: "testlogin" })
      .expect(200);

    expect(res.body.token).toBeTruthy();
    expect(res.body.agency || res.body.user).toBeDefined();
  });

  it("401: rejects wrong creds", async () => {
    await request(app)
      .post("/api/agency/agencylogin")
      .send({ agency_name: "Test Agency", loginId: "WRONG" })
      .expect(401);
  });
});
