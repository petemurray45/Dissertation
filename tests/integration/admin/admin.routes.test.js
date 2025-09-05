// tests/integration/admin/admin.routes.test.js
import request from "supertest";
import app from "../../../backend/server.js"; // or wherever you export Express app
import { resetTestDb } from "../../setup/reset-test-db.js";
import jwt from "jsonwebtoken";

function adminToken(id = 1) {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
}

describe("Admin routes (integration)", () => {
  beforeEach(async () => {
    await resetTestDb();
  });

  describe("POST /api/admin/properties", () => {
    it("creates a property when admin JWT is provided", async () => {
      const token = adminToken();

      const res = await request(app)
        .post("/api/admin/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Admin Created Room",
          location: "Belfast",
          price_per_month: 800,
          agency_id: 1,
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Admin Created Room");
    });

    it("rejects creation without admin token", async () => {
      await request(app)
        .post("/api/admin/properties")
        .send({
          title: "Not Allowed",
          location: "Belfast",
          price_per_month: 600,
          agency_id: 1,
        })
        .expect(401);
    });
  });

  describe("POST /api/admin/agencies", () => {
    it("creates an agency with valid admin JWT", async () => {
      const token = adminToken();

      const res = await request(app)
        .post("/api/admin/agencies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          agency_name: "New Test Agency",
          agency_email: "agency@example.com",
          phone: "07123456789",
        })
        .expect(201);

      expect(res.body.agency_name).toBe("New Test Agency");
    });

    it("forbids access with non-admin role", async () => {
      const token = jwt.sign(
        { id: 99, role: "user" },
        process.env.JWT_SECRET || "secret"
      );

      await request(app)
        .post("/api/admin/agencies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          agency_name: "Should Not Work",
          agency_email: "bad@example.com",
          phone: "0711111111",
        })
        .expect(403);
    });
  });

  describe("GET /api/admin/agencies", () => {
    it("lists agencies for admins", async () => {
      const token = adminToken();

      const res = await request(app)
        .get("/api/admin/agencies")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
