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

describe("PUT /api/agency/me (update agency profile)", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true }); // gives you agency id 1 and baseline data
  });

  it("200: updates basic profile fields", async () => {
    const t = agentToken(1);

    const pay = {
      agency_name: "Updated Name",
      agency_email: "updated@example.com",
      phone: "07123 456789",
      website: "https://updated.example",
      logo_url: "https://placehold.co/64x64",
    };

    const res = await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .send(pay)
      .expect(200);

    // minimal shape + fields changed
    expect(res.body).toBeDefined();
    expect(res.body.data || res.body.agency || res.body).toEqual(
      expect.objectContaining({
        agency_name: "Updated Name",
        agency_email: "updated@example.com",
        phone: "07123 456789",
        website: "https://updated.example",
        logo_url: "https://placehold.co/64x64",
      })
    );

    // verify persisted by fetching me again
    const me = await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .expect(200);

    expect(me.body.agency.agency_name).toBe("Updated Name");
    expect(me.body.agency.agency_email).toBe("updated@example.com");
  });

  it("401: rejects when no token present", async () => {
    await request(app)
      .put("/api/agency/me")
      .send({ agency_name: "Nope" })
      .expect(401);
  });

  it("403: blocks non-agent roles", async () => {
    await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${userToken()}`)
      .send({ agency_name: "Nope" })
      .expect(403);

    await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ agency_name: "Nope" })
      .expect(403);
  });

  it("400: rejects invalid email / phone format", async () => {
    const t = agentToken(1);

    // invalid email
    await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .send({ agency_email: "not-an-email" })
      .expect(400);

    // invalid phone (too short)
    await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .send({ phone: "12" })
      .expect(400);
  });

  it("401: changing login id requires correct current_login_id_hash", async () => {
    const t = agentToken(1);

    // wrong current login id (frontend expects a 401 for this case)
    await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .send({
        current_login_id_hash: "WRONG",
        new_login_id_hash: "newSecret123",
      })
      .expect(401);
  });

  it("200: can change login id with correct current login id", async () => {
    const t = agentToken(1);

    await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .send({
        current_login_id_hash: "testlogin", // seeded value in your test seed
        new_login_id_hash: "newSecret123",
      })
      .expect(200);

    // optional: verify you can log in with the new login id
    // (adjust the route if your login path differs)
    const login = await request(app)
      .post("/api/agency/agencyLogin")
      .send({ agency_name: "Test Agency", loginId: "newSecret123" });

    expect([200, 201]).toContain(login.status);
    expect(login.body.token).toBeTruthy();
  });

  it("only updates provided fields (partial update)", async () => {
    const t = agentToken(1);

    // send minimal payload: only phone
    const res = await request(app)
      .put("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .send({ phone: "07000 000000" })
      .expect(200);

    expect(res.body.data || res.body.agency || res.body).toEqual(
      expect.objectContaining({
        phone: "07000 000000",
      })
    );

    // fetch and ensure other known fields unchanged (from seed defaults)
    const me = await request(app)
      .get("/api/agency/me")
      .set("Authorization", `Bearer ${t}`)
      .expect(200);

    expect(me.body.agency.phone).toBe("07000 000000");
    // seeded name was "Test Agency"
    expect(me.body.agency.agency_name).toMatch(/test agency/i);
  });
});
