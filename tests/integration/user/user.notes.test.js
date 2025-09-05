import request from "supertest";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

// --- helpers ---
async function loginSeedUser() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "testuser@example.com", password: "password123" })
    .expect(200);
  return res.body.token;
}

async function registerAndLogin(email) {
  // register
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Other User", email, password: "Passw0rd!" })
    .expect((r) => {
      if (![200, 201].includes(r.status))
        throw new Error(`Reg failed ${r.status}`);
    });
  // login
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "Passw0rd!" })
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

describe("User Notes (/api/user/notes)", () => {
  let userToken;
  let propertyId;

  beforeEach(async () => {
    await resetTestDb({ reseed: true });
    userToken = await loginSeedUser();
    propertyId = await firstPropertyId();
  });

  it("POST creates a note and returns id", async () => {
    const res = await request(app)
      .post("/api/user/notes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ property_id: propertyId, content: "Nice place" });

    expect([200, 201]).toContain(res.status);
    const note = res.body?.note || res.body?.data || res.body;
    expect(note.id || note.note_id).toBeTruthy();
    expect(note.property_id ?? note.propertyId).toBe(propertyId);
  });

  it("GET returns only the user’s notes for that property", async () => {
    // create two notes as seed user
    await request(app)
      .post(`/api/user/notes/${propertyId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ property_id: propertyId, content: "First" })
      .expect((r) => {
        if (![200, 201].includes(r.status)) throw new Error();
      });

    await request(app)
      .post(`/api/user/notes/${propertyId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ property_id: propertyId, content: "Second" })
      .expect((r) => {
        if (![200, 201].includes(r.status)) throw new Error();
      });

    // create a note as someone else on same property (should not appear)
    const otherToken = await registerAndLogin("other@example.com");
    await request(app)
      .post("/api/user/notes")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ property_id: propertyId, content: "Other user note" })
      .expect((r) => {
        if (![200, 201].includes(r.status)) throw new Error();
      });

    // fetch as seed user
    const res = await request(app)
      .get(`/api/user/notes/${propertyId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    const list = res.body?.notes || res.body?.data || res.body;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(2);
    // ensure none belong to "other" user (no user_id exposed? then assert contents)
    const contents = list.map((n) => n.content?.toLowerCase?.() ?? "");
    expect(contents).toContain("first");
    expect(contents).toContain("second");
    expect(contents).not.toContain("other user note");
  });

  it("DELETE removes only own note; deleting others’ note → 403", async () => {
    // create as user A
    const createA = await request(app)
      .post("/api/user/notes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ property_id: propertyId, content: "Mine" });

    const noteIdA =
      createA.body.note?.id || createA.body.data?.id || createA.body.id;

    // create as user B
    const otherToken = await registerAndLogin("deleter@example.com");
    const createB = await request(app)
      .post("/api/user/notes")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ property_id: propertyId, content: "Not yours" });

    const noteIdB =
      createB.body.note?.id || createB.body.data?.id || createB.body.id;

    // user A can delete A's note
    const delA = await request(app)
      .delete(`/api/user/notes/${noteIdA}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect([200, 204]).toContain(delA.status);

    // user A cannot delete B's note
    await request(app)
      .delete(`/api/user/notes/${noteIdB}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect((r) => {
        if (![403, 404].includes(r.status)) {
          throw new Error(
            `Expected 403/404 when deleting others’ note, got ${r.status}`
          );
        }
      });
  });

  it("Validation: missing content → 400", async () => {
    await request(app)
      .post("/api/user/notes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ property_id: propertyId }) // no content
      .expect(400);
  });

  describe("Auth guards", () => {
    it("401 on POST without token", async () => {
      await request(app)
        .post("/api/user/notes")
        .send({ property_id: propertyId, content: "x" })
        .expect(401);
    });

    it("401 on GET without token", async () => {
      await request(app).get(`/api/user/notes/${propertyId}`).expect(401);
    });

    it("401 on DELETE without token", async () => {
      await request(app).delete(`/api/user/notes/123`).expect(401);
    });
  });
});
