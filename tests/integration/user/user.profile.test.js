import request from "supertest";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

// --- helpers ---
async function loginSeedUser() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "testuser@example.com", password: "password123" })
    .expect(200);
  return { token: res.body.token, user: res.body.user };
}

async function registerAndLogin(email, password = "Passw0rd!") {
  // register
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Other User", email, password })
    .expect((r) => {
      if (![200, 201].includes(r.status)) {
        throw new Error(`Registration failed with status ${r.status}`);
      }
    });
  // login
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);
  return { token: res.body.token, user: res.body.user };
}

describe("Profile (/api/user/profile/:id)", () => {
  let seedToken;
  let seedUser;

  beforeEach(async () => {
    await resetTestDb({ reseed: true });
    const auth = await loginSeedUser();
    seedToken = auth.token;
    seedUser = auth.user; // { id, email, ... }
  });

  it("PATCH updates name, email, photo, password and returns updated record", async () => {
    const newEmail = "updated@example.com";
    const newName = "Updated Test User";
    const newPhoto = "https://cdn.example.com/pic.png";
    const newPassword = "NewPassw0rd!";

    // Update
    const res = await request(app)
      .patch(`/api/user/profile/${seedUser.id}`)
      .set("Authorization", `Bearer ${seedToken}`)
      .send({
        full_name: newName,
        email: newEmail,
        photoUrl: newPhoto,
        password: newPassword,
      })
      .expect(200);

    const updated = res.body?.user || res.body?.data || res.body;
    expect(updated).toBeTruthy();
    expect(updated.id).toBe(seedUser.id);
    expect(updated.full_name || updated.fullName).toBe(newName);
    expect(updated.email).toBe(newEmail);
    expect(updated.photo_url || updated.photoUrl).toBe(newPhoto);

    // Can login with the new password
    await request(app)
      .post("/api/auth/login")
      .send({ email: newEmail, password: newPassword })
      .expect(200);
  });

  it("PATCH duplicate email > 409", async () => {
    // Create another user whose email we'll try to steal
    const other = await registerAndLogin("taken@example.com");

    const res = await request(app)
      .patch(`/api/user/profile/${seedUser.id}`)
      .set("Authorization", `Bearer ${seedToken}`)
      .send({ email: "taken@example.com" })
      .expect((r) => {
        if (r.status !== 409) {
          throw new Error(`Expected 409, got ${r.status}`);
        }
      });

    expect((res.body?.error || "").toLowerCase()).toContain("email");
  });

  it("PATCH with missing/invalid fields > 400 ", async () => {
    // NOTE: This test assumes your controller rejects an empty payload.
    // If your current controller allows empty updates, add a guard like:
    // if (!full_name && !email && !password && !photoUrl) return res.status(400).json({ error: "No fields to update" });
    await request(app)
      .patch(`/api/user/profile/${seedUser.id}`)
      .set("Authorization", `Bearer ${seedToken}`)
      .send({}) // nothing to update
      .expect(400);
  });

  it("Auth guard 401 when not logged in", async () => {
    await request(app)
      .patch(`/api/user/profile/${seedUser.id}`)
      .send({ full_name: "Nope" })
      .expect(401);
  });

  it("Wrong user id in URL > 403/401 otherwise ignore param and update logged-in user", async () => {
    const wrongId = seedUser.id + 9999;

    const res = await request(app)
      .patch(`/api/user/profile/${wrongId}`)
      .set("Authorization", `Bearer ${seedToken}`)
      .send({ full_name: "only affect logged in user" })
      .expect((r) => {
        // Accept either strict behavior or current implementation that ignores :id
        if (![200, 401, 403].includes(r.status)) {
          throw new Error(`Expected 200/401/403, got ${r.status}`);
        }
      });

    if (res.status === 200) {
      const updated = res.body?.user || res.body?.data || res.body;
      expect(updated.id).toBe(seedUser.id);
      expect(updated.id).not.toBe(wrongId);
      expect(updated.full_name || updated.fullName).toBe(
        "only affect logged in user"
      );
    }
  });
});
