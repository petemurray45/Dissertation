import { describe, beforeEach, it, expect } from "vitest";
import request, { agent } from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";
import { sql } from "../../../backend/config/db.js";

const SECRET = process.env.JWT_SECRET || "testsecret";

// token helpers
const agentToken = (agencyId = 1) =>
  jwt.sign({ role: "agent", agencyId, id: agencyId }, SECRET, {
    expiresIn: "1h",
  });
const userToken = (userId = 1) =>
  jwt.sign({ role: "user", userId, id: userId }, SECRET, { expiresIn: "1h" });

const validPayload = () => ({
  title: "New Listing",
  description: "Nice place",
  price_per_month: 800,
  propertyType: "Flat",
  ensuite: "Yes",
  bedType: "Double",
  wifi: "Yes",
  pets: "No",
  location: "Manchester, UK",
  latitude: 53.4808,
  longitude: -2.2426,
  images: ["https://picsum.photos/seed/x/800/500"],
});

describe("Agency -> properties CRUD", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true });
  });

  it("201: agent can create property; agency_id is taken from token (ignores body)", async () => {
    const res = await request(app)
      .post("/api/properties")
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .send({ ...validPayload(), agency_id: 999 }) // ignored for agents
      .expect(201);

    const created =
      (res.body?.data && res.body.data[0]) || res.body?.data || res.body;
    expect(created).toBeDefined();

    // ensure row persisted with correct agency_id
    const rows =
      await sql`SELECT agency_id FROM properties WHERE id = ${created.id}`;
    expect(rows[0].agency_id).toBe(1);
  });

  it("400: create validation — missing required fields", async () => {
    await request(app)
      .post("/api/properties")
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .send({ title: "Only title" }) // missing everything else
      .expect(400);
  });

  it("401: create blocked without token", async () => {
    await request(app).post("/api/properties").send(validPayload()).expect(401);
  });

  it("200: agent can update their own property", async () => {
    // get a property that belongs to agency 1
    const [prop] =
      await sql`SELECT id, agency_id FROM properties ORDER BY id LIMIT 1`;
    expect(prop.agency_id).toBe(1);

    const res = await request(app)
      .put(`/api/properties/${prop.id}`)
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .send({ title: "Updated Title", wifi: true, ensuite: true, pets: true })
      .expect(200);

    // confirm persisted
    const after =
      await sql`SELECT title, wifi FROM properties WHERE id = ${prop.id}`;
    expect(after[0].title).toBe("Updated Title");
    expect(after[0].wifi).toBe(true);
  });

  it("403: agent cannot update a property belonging to another agency", async () => {
    // another agency and one of its properties
    const otherAgency =
      await sql`INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website)
                VALUES ('Other Agency', 'other@example.com', '07000000000', 'x', 'other.example')
                RETURNING id`;
    const otherId = otherAgency[0].id;

    const inserted =
      await sql`INSERT INTO properties (title, description, price_per_month, location, latitude, longitude,
               bed_type, ensuite, wifi, pets, property_type, agency_id)
               VALUES ('Other Prop', 'desc', 500, 'Belfast', 53.8, -1.55,
               'Double', true, true, false, 'Flat'::property_type_enum1, ${otherId})
               RETURNING id`;
    const otherPropId = inserted[0].id;

    await request(app)
      .put(`/api/properties/${otherPropId}`)
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .send({ title: "Should Fail" })
      .expect(403);
  });

  it("404: update non-existent property", async () => {
    await request(app)
      .patch(`/api/properties/999999`)
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .send({ title: "Nope" })
      .expect(404);
  });

  it("200: agent can delete their own property", async () => {
    const [prop] =
      await sql`INSERT INTO properties (title, description, price_per_month, location, latitude, longitude,
               bed_type, ensuite, wifi, pets, property_type, agency_id)
               VALUES ('Tmp', 'desc', 400, 'Belfast', 54.5973, -5.9301,
               'Single', false, false, false, 'Flat'::property_type_enum1, 1)
               RETURNING id`;

    await request(app)
      .delete(`/api/properties/${prop.id}`)
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .expect(200);

    const check =
      await sql`SELECT id FROM properties WHERE id = ${prop.id} LIMIT 1`;
    expect(check.length).toBe(0);
  });

  it("403: agent cannot delete a property that belongs to another agency", async () => {
    // other agency + property again
    const otherAgency =
      await sql`INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website)
                VALUES ('Another Agency', 'another@example.com', '07000000001', 'x', 'another.example')
                RETURNING id`;
    const otherId = otherAgency[0].id;

    const [prop] =
      await sql`INSERT INTO properties (title, description, price_per_month, location, latitude, longitude,
               bed_type, ensuite, wifi, pets, property_type, agency_id)
               VALUES ('Not Yours', 'desc', 600, 'Derry', 54.9966, -7.3086,
               'Double', true, true, false, 'Flat'::property_type_enum1, ${otherId})
               RETURNING id`;

    await request(app)
      .delete(`/api/properties/${prop.id}`)
      .set("Authorization", `Bearer ${agentToken(1)}`)
      .expect(403);
  });
});
