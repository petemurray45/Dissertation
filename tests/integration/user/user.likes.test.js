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

async function getFirstPropertyId() {
  // adjust to your list endpoint/shape if needed
  const res = await request(app).get("/api/properties").expect(200);

  const rows = res.body?.data || res.body || [];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No properties found in test seed");
  }
  return rows[0].id ?? rows[0].property_id ?? rows[0].ID;
}

describe("User Likes (/api/user/likes)", () => {
  let token;
  let propertyId;

  beforeEach(async () => {
    await resetTestDb({ reseed: true });
    token = await loginSeedUser();
    propertyId = await getFirstPropertyId();
  });

  it("GET before like -> liked:false ", async () => {
    const res = await request(app)
      .get(`/api/user/likes`)
      .set("Authorization", `Bearer ${token}`)
      .query({ propertyId })
      .expect(200);

    expect(res.body).toHaveProperty("liked");
    expect(res.body.liked).toBe(false);
  });

  it("POST like -> 200/201 then GET shows  liked:true ", async () => {
    const post = await request(app)
      .post(`/api/user/likes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ propertyId });

    expect([200, 201]).toContain(post.status);

    const check = await request(app)
      .get(`/api/user/likes`)
      .set("Authorization", `Bearer ${token}`)
      .query({ propertyId })
      .expect(200);

    expect(check.body.liked).toBe(true);
  });

  it("DELETE like  then GET shows liked - false ", async () => {
    // first like it
    await request(app)
      .post(`/api/user/likes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ propertyId })
      .expect((res) => {
        if (![200, 201].includes(res.status)) {
          throw new Error(`Expected 200/201, got ${res.status}`);
        }
      });

    // then unlike
    const del = await request(app)
      .delete(`/api/user/likes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ propertyId });

    expect([200, 204]).toContain(del.status);

    // confirm
    const check = await request(app)
      .get(`/api/user/likes`)
      .set("Authorization", `Bearer ${token}`)
      .query({ propertyId })
      .expect(200);

    expect(check.body.liked).toBe(false);
  });

  describe("Auth guards", () => {
    it("GET /likes without token → 401", async () => {
      const res = await request(app)
        .get(`/api/user/likes`)
        .query({ propertyId })
        .expect(401);
    });

    it("POST /likes without token → 401", async () => {
      await request(app)
        .post(`/api/user/likes`)
        .send({ propertyId })
        .expect(401);
    });

    it("DELETE /likes without token → 401", async () => {
      await request(app)
        .delete(`/api/user/likes`)
        .send({ propertyId })
        .expect(401);
    });
  });
});
