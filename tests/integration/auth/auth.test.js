import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

const SECRET = process.env.JWT_SECRET || "testsecret";

describe("UUser auth", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true });
  });

  describe("POST /api/auth/register", () => {
    it("201: creates a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Alice Example",
          email: "alice@example.com",
          password: "StrongPass123!",
        })
        .expect(201);

      const { user } = res.body;

      expect(res.body.token).toBeTruthy();
      expect(user.email).toBe("alice@example.com");
      expect(user.full_name ?? user.name).toBe("Alice Example");
    });
  });

  it(" duplicate email rejected", async () => {
    // first time ok
    await request(app).post("/api/auth/register").send({
      full_name: "Bob",
      email: "bob@example.com",
      password: "Secret123!",
    });

    // second time should fail
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        full_name: "Bob Again",
        email: "bob@example.com",
        password: "Another123!",
      })
      .expect((res) => {
        // allow either 400 or 409 depending on your controller
        if (![400, 409].includes(res.status)) {
          throw new Error(`Expected 400/409, got ${res.status}`);
        }
      });

    expect(res.body.error).toMatch(/exists|duplicate/i);
  });

  describe("POST /api/auth/login", () => {
    it("200: valid credentials return token", async () => {
      // seed user first
      await request(app).post("/api/auth/register").send({
        full_name: "Charlie",
        email: "charlie@example.com",
        password: "LoginPass1!",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "charlie@example.com",
          password: "LoginPass1!",
        })
        .expect(200);

      expect(res.body.token).toBeTruthy();
      expect(res.body.user.email).toBe("charlie@example.com");
    });

    it(" wrong credentials rejected", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nobody@example.com",
          password: "wrongpw",
        })
        .expect(401);

      expect(res.body.error).toMatch(/invalid|credentials/i);
    });
  });

  describe("GET /api/auth/me", () => {
    it("200: returns user profile with valid token", async () => {
      const register = await request(app).post("/api/auth/register").send({
        full_name: "Dana",
        email: "dana@example.com",
        password: "Profile123!",
      });

      const token = register.body.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.user.email).toBe("dana@example.com");
    });

    it("401: rejects without token", async () => {
      const res = await request(app).get("/api/auth/me").expect(401);
      const msg = (res.body && res.body.error) || res.text || "";
      expect(msg.toLowerCase()).toMatch(/no token/i);
    });
  });
});
