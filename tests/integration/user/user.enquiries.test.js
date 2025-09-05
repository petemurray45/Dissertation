import request from "supertest";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

async function loginSeedUser() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "testuser@example.com", password: "password123" })
    .expect(200);
  return res.body.token;
}

async function registerAndLogin(email) {
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Other User", email, password: "password" })
    .expect((r) => {
      if (![200, 201].includes(r.status))
        throw new Error(`Reg failed ${r.status}`);
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password" })
    .expect(200);
  return res.body.token;
}

async function firstPropertyId() {
  const res = await request(app).get("/api/properties").expect(200);
  const rows = res.body?.data || res.body || [];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No seeded properties found");
  }
  return rows[0].id ?? rows[0].property_id ?? rows[0].ID;
}

describe("User enquiries /api/user/enquiries", () => {
  let userToken;
  let otherToken;
  let propertyId;

  beforeEach(async () => {
    await resetTestDb({ reseed: true });
    userToken = await loginSeedUser();
    otherToken = await registerAndLogin("someoneelse@example.com");
    propertyId = await firstPropertyId();
  });

  it("GET returns all enquiries for the logged-in user (and only theirs)", async () => {
    // seed enquiry for main user
    const mine1 = "hello";
    const mine2 = "hello2";

    await request(app)
      .post("/api/properties/enquiries")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        property_id: propertyId,
        full_name: "Seed User",
        email: "testuser@example.com",
        message: mine1,
      })
      .expect((r) => {
        if (![200, 201].includes(r.status))
          throw new Error(`create1 ${r.status}`);
      });

    await request(app)
      .post("/api/properties/enquiries")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        property_id: propertyId,
        full_name: "Seed User",
        email: "testuser@example.com",
        message: mine2,
      })
      .expect((r) => {
        if (![200, 201].includes(r.status))
          throw new Error(`create 2 ${r.status}`);
      });

    // seed enquiry from another user - shouldnt appear
    const notMine = "Different user enquiry";
    await request(app)
      .post("/api/properties/enquiries")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        property_id: propertyId,
        full_name: "Other User",
        email: "someoneelse@example.com",
        message: notMine,
      })
      .expect((r) => {
        if (![200, 201].includes(r.status))
          throw new Error(`create other ${r.status}`);
      });

    // fetch enqurieis for main user
    const res = await request(app)
      .get("/api/user/enquiries")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    // flexible regarding shape of response
    const list = res.body?.enquiries || res.body?.data || res.body;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(2);

    const msgs = list.map((e) => (e.message || e.msg || "").toLowerCase());
    expect(msgs).toContain(mine1.toLowerCase());
    expect(msgs).toContain(mine2.toLowerCase());
    expect(msgs).not.toContain(notMine.toLowerCase());
  });
});
