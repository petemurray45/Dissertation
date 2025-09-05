import request from "supertest";
import app from "../../../backend/app.js";
import { resetTestDb } from "../../setup/reset-test-db.js";

// helpers
function pickId(row) {
  return row.id ?? row.property_id ?? row.ID;
}
function pickPrice(row) {
  return row.price ?? row.list_price ?? row.amount;
}
function pickLocation(row) {
  return row.location ?? row.address ?? row.city ?? row.town;
}
function pickLat(row) {
  return row.lat ?? row.latitude ?? row.geo_lat;
}
function pickLng(row) {
  return row.lng ?? row.lon ?? row.longitude ?? row.geo_lng;
}

describe("Properties (/api/properties) — public endpoints", () => {
  beforeEach(async () => {
    await resetTestDb({ reseed: true });
  });

  it("GET /api/properties returns a list with expected shape", async () => {
    const res = await request(app).get("/api/properties").expect(200);

    const list = res.body?.data || res.body || [];
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);

    const p = list[0];
    // basic shape checks
    expect(pickId(p)).toBeTruthy();
    expect(typeof pickPrice(p)).toBe("number");
    expect(typeof pickLocation(p)).toBe("string");

    // coords should be numbers
    const lat = pickLat(p);
    const lng = pickLng(p);
    if (lat !== undefined) expect(typeof lat).toBe("number");
    if (lng !== undefined) expect(typeof lng).toBe("number");
  });

  it("GET /api/properties supports price range filtering", async () => {
    // get all first to discover a reasonable price range from seed data
    const all = await request(app).get("/api/properties").expect(200);
    const rows = all.body?.data || all.body || [];
    expect(rows.length).toBeGreaterThan(0);

    // mid range filter that shouldr return at least one record
    const prices = rows.map(pickPrice).filter((n) => typeof n === "number");
    prices.sort((a, b) => a - b);
    const mid = prices[Math.floor(prices.length / 2)];
    const min = Math.max(0, mid - 1); // inclusive lower bound
    const max = mid + 1; // inclusive upper bound

    const res = await request(app)
      .get("/api/properties")
      .query({ minPrice: min, maxPrice: max })
      .expect(200);

    const list = res.body?.data || res.body || [];
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    for (const p of list) {
      const price = pickPrice(p);
      expect(price).toBeGreaterThanOrEqual(min);
      expect(price).toBeLessThanOrEqual(max);
    }
  });

  it("GET /api/properties/search returns results within a radius", async () => {
    // pull a property to anchor the radius search
    const all = await request(app).get("/api/properties").expect(200);
    const rows = all.body?.data || all.body || [];
    const anchor = rows.find(
      (r) => pickLat(r) !== undefined && pickLng(r) !== undefined
    );

    // if seed doesnt have coords skip
    if (!anchor) {
      console.warn("Seed has no coords; skipping radius check.");
      return;
    }

    const lat = pickLat(anchor);
    const lng = pickLng(anchor);
    const id = pickId(anchor);

    // small radius should include the anchor property
    const resNear = await request(app)
      .get("/api/properties/search")
      .query({
        lat,
        lng,
        radius_km: 1, // both styles
        radiusKm: 1,
        radius: 1,
      })
      .expect(200);

    const listNear = resNear.body?.data || resNear.body || [];
    const idsNear = listNear.map(pickId);
    expect(idsNear).toContain(id);

    // far away point should exclude the anchor
    const resFar = await request(app)
      .get("/api/properties/search")
      .query({
        lat: lat + 5,
        lng: lng + 5,
        radius_km: 1,
        radiusKm: 1,
        radius: 1,
      })
      .expect(200);

    const listFar = resFar.body?.data || resFar.body || [];
    const idsFar = listFar.map(pickId);
    expect(idsFar).not.toContain(id);
  });

  it("GET /api/properties/:id returns a single property and invalid id = 404", async () => {
    // get an existing id
    const all = await request(app).get("/api/properties").expect(200);
    const rows = all.body?.data || all.body || [];
    expect(rows.length).toBeGreaterThan(0);

    const existingId = pickId(rows[0]);

    // valid id
    const byId = await request(app)
      .get(`/api/properties/${existingId}`)
      .expect(200);

    const prop = byId.body?.data || byId.body || {};
    expect(pickId(prop)).toBe(existingId);
    expect(typeof pickLocation(prop)).toBe("string");

    // invalid id (very large, unlikely to exist)
    await request(app).get("/api/properties/99999999").expect(404);
  });
});
