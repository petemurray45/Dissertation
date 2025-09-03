// tests/unit/middleware/guard.middleware.test.js
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../../../backend/config/db.js", () => ({
  sql: jest.fn(),
}));

// import after mocking
const { sql } = await import("../../../backend/config/db.js");
const { ensureSelfOrAdmin, canManageProperty, attachAgencyOnCreate } =
  await import("../../../backend/middleware/guards.js");

// helper to mock res
function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((obj) => {
    res.body = obj;
    return res;
  });
  return res;
}

describe("guard middleware", () => {
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  describe("ensureSelfOrAdmin", () => {
    it("allows admin", () => {
      const req = { auth: { role: "admin" }, params: { id: "5" } };
      const res = createRes();

      ensureSelfOrAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("allows agent if ids match", () => {
      const req = { auth: { role: "agent", agencyId: 7 }, params: { id: "7" } };
      const res = createRes();

      ensureSelfOrAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("blocks agent if ids differ", () => {
      const req = { auth: { role: "agent", agencyId: 1 }, params: { id: "2" } };
      const res = createRes();

      ensureSelfOrAdmin(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/forbidden/i);
    });
  });

  describe("canManageProperty", () => {
    it("allows admin", async () => {
      const req = { auth: { role: "admin" }, params: { id: "10" } };
      const res = createRes();

      await canManageProperty(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("blocks non-agent", async () => {
      const req = { auth: { role: "user" }, params: { id: "10" } };
      const res = createRes();

      await canManageProperty(req, res, next);
      expect(res.statusCode).toBe(403);
    });

    it("returns 404 if property not found", async () => {
      sql.mockResolvedValueOnce([]);
      const req = {
        auth: { role: "agent", agencyId: 5 },
        params: { id: "10" },
      };
      const res = createRes();

      await canManageProperty(req, res, next);
      expect(res.statusCode).toBe(404);
    });

    it("blocks if property agency_id does not match", async () => {
      sql.mockResolvedValueOnce([{ agency_id: 99 }]);
      const req = {
        auth: { role: "agent", agencyId: 5 },
        params: { id: "10" },
      };
      const res = createRes();

      await canManageProperty(req, res, next);
      expect(res.statusCode).toBe(403);
    });

    it("allows if property agency_id matches", async () => {
      sql.mockResolvedValueOnce([{ agency_id: 5 }]);
      const req = {
        auth: { role: "agent", agencyId: 5 },
        params: { id: "10" },
      };
      const res = createRes();

      await canManageProperty(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("returns 500 on db error", async () => {
      sql.mockRejectedValueOnce(new Error("db fail"));
      const req = {
        auth: { role: "agent", agencyId: 5 },
        params: { id: "10" },
      };
      const res = createRes();

      await canManageProperty(req, res, next);
      expect(res.statusCode).toBe(500);
    });
  });

  describe("attachAgencyOnCreate", () => {
    it("allows admin and keeps agency_id", () => {
      const req = {
        auth: { role: "admin", agencyId: 1 },
        body: { agency_id: 2 },
      };
      const res = createRes();

      attachAgencyOnCreate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.body.agency_id).toBe(2);
    });

    it("blocks agent if agency_id in body differs", () => {
      const req = {
        auth: { role: "agent", agencyId: 5 },
        body: { agency_id: 6 },
      };
      const res = createRes();

      attachAgencyOnCreate(req, res, next);
      expect(res.statusCode).toBe(403);
    });

    it("sets agency_id if missing", () => {
      const req = { auth: { role: "agent", agencyId: 5 }, body: {} };
      const res = createRes();

      attachAgencyOnCreate(req, res, next);
      expect(req.body.agency_id).toBe(5);
      expect(next).toHaveBeenCalled();
    });
  });
});
