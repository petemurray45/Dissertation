import { jest } from "@jest/globals";

// --- mocks (must be declared before importing the SUT) ---
jest.unstable_mockModule("../../../backend/config/db.js", () => ({
  sql: jest.fn(),
}));
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
    genSalt: jest.fn(),
    compare: jest.fn(),
  },
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

// pull in the mocked deps and controller under test
const { sql } = await import("../../../backend/config/db.js");
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;

const {
  registerAgency,
  agencyLogin,
  fetchPropertyByAgency,
  getAgencyMe,
  listAgencies,
  updateAgency,
  deleteAgency,
  fetchAgencyEnquiries,
  updateEnquiryStatus,
} = await import("../../../backend/controllers/agencyController.js");

// --- helpers ---
function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((payload) => {
    res.body = payload;
    return res;
  });
  res.sendStatus = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  return res;
}

describe("agencyController", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    sql.mockReset();
    bcrypt.hash.mockReset();
    bcrypt.genSalt.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
    jwt.verify.mockReset();

    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  // ---------- registerAgency ----------
  describe("registerAgency", () => {
    test("201 + token + agency on success", async () => {
      bcrypt.hash.mockResolvedValueOnce("hashed-login-id");
      sql.mockResolvedValueOnce([
        {
          id: 99,
          agency_name: "Acme",
          agency_email: "a@acme.com",
          phone: "0123456",
          website: "acme.test",
          logo_url: null,
        },
      ]);
      jwt.sign.mockReturnValueOnce("jwt-token");

      const req = {
        body: {
          agency_name: "Acme",
          agency_email: "a@acme.com",
          phone: "0123456",
          loginId: "secret",
          website: "acme.test",
        },
      };
      const res = createRes();

      await registerAgency(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("secret", 10);
      expect(sql).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { agencyId: 99, role: "agent" },
        "test-secret",
        { expiresIn: "2h" }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.body).toEqual({
        token: "jwt-token",
        agency: expect.objectContaining({ id: 99, agency_name: "Acme" }),
      });
    });

    test("500 on DB error", async () => {
      bcrypt.hash.mockResolvedValueOnce("x");
      sql.mockRejectedValueOnce(new Error("db down"));

      const req = { body: {} };
      const res = createRes();

      await registerAgency(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Failed to register agency" });
    });
  });

  // ---------- agencyLogin ----------
  describe("agencyLogin", () => {
    test("401 when agency not found", async () => {
      sql.mockResolvedValueOnce([]); // none
      const req = { body: { agency_name: "Acme", loginId: "pw" } };
      const res = createRes();

      await agencyLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body).toEqual({ error: "Invalid credentials" });
    });

    test("401 when loginId mismatch", async () => {
      sql.mockResolvedValueOnce([{ id: 1, login_id_hash: "hash" }]);
      bcrypt.compare.mockResolvedValueOnce(false);

      const req = { body: { agency_name: "Acme", loginId: "bad" } };
      const res = createRes();

      await agencyLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body).toEqual({ error: "Invalid credentials" });
    });

    test("200 with token+agency on success", async () => {
      sql.mockResolvedValueOnce([
        { id: 1, login_id_hash: "hash", agency_name: "Acme" },
      ]);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce("jwt");

      const req = { body: { agency_name: "Acme", loginId: "ok" } };
      const res = createRes();

      await agencyLogin(req, res);
      expect(jwt.sign).toHaveBeenCalledWith(
        { agencyId: 1, role: "agent" },
        "test-secret",
        { expiresIn: "2hr" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: "jwt",
        agency: expect.objectContaining({ id: 1 }),
      });
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("boom"));
      const res = createRes();
      await agencyLogin({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Login failed" });
    });
  });

  // ---------- fetchPropertyByAgency ----------
  describe("fetchPropertyByAgency", () => {
    test("200 with properties + images + pagination", async () => {
      sql
        .mockResolvedValueOnce([
          { id: 10, title: "P1", agency_id: 5 },
          { id: 11, title: "P2", agency_id: 5 },
        ]) // properties
        .mockResolvedValueOnce([{ count: 2 }]) // count
        .mockResolvedValueOnce([
          { property_id: 10, image_url: "img-a" },
          { property_id: 10, image_url: "img-b" },
          { property_id: 11, image_url: "img-c" },
        ]); // images

      const req = { params: { id: "5" }, query: { page: "1", limit: "6" } };
      const res = createRes();

      await fetchPropertyByAgency(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          properties: expect.arrayContaining([
            expect.objectContaining({ id: 10, imageUrls: ["img-a", "img-b"] }),
            expect.objectContaining({ id: 11, imageUrls: ["img-c"] }),
          ]),
          totalCount: 2,
          page: 1,
          limit: 6,
        })
      );
    });

    test("200 with empty properties when none found", async () => {
      sql
        .mockResolvedValueOnce([]) // properties
        .mockResolvedValueOnce([{ count: 0 }]); // count

      const res = createRes();
      await fetchPropertyByAgency({ params: { id: "2" }, query: {} }, res);
      expect(res.json).toHaveBeenCalledWith({
        properties: [],
        totalCount: 0,
      });
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("fail"));
      const res = createRes();
      await fetchPropertyByAgency({ params: { id: "2" }, query: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Failed to fetch properties" });
    });
  });

  // ---------- getAgencyMe ----------
  describe("getAgencyMe", () => {
    test("401 when no auth", async () => {
      const res = createRes();
      await getAgencyMe({ auth: {} }, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body).toEqual({ error: "No auth" });
    });

    test("404 when not found", async () => {
      sql.mockResolvedValueOnce([]);
      const res = createRes();
      await getAgencyMe({ auth: { agencyId: 77 } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.body).toEqual({ error: "Agency not found" });
    });

    test("200 with agency", async () => {
      sql.mockResolvedValueOnce([{ id: 1, agency_name: "A" }]);
      const res = createRes();
      await getAgencyMe({ auth: { agencyId: 1 } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        agency: { id: 1, agency_name: "A" },
      });
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("x"));
      const res = createRes();
      await getAgencyMe({ auth: { agencyId: 1 } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Failed to fetch agency" });
    });
  });

  // ---------- listAgencies ----------
  describe("listAgencies", () => {
    test("200 with agencies", async () => {
      sql.mockResolvedValueOnce([{ id: 1, agency_name: "A" }]);
      const res = createRes();
      await listAgencies({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        agencies: [{ id: 1, agency_name: "A" }],
      });
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("bad"));
      const res = createRes();
      await listAgencies({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Failed to fetch agencies" });
    });
  });

  // ---------- updateAgency ----------
  describe("updateAgency", () => {
    test("403 when current agency not found", async () => {
      sql.mockResolvedValueOnce([]); // SELECT *
      const res = createRes();
      await updateAgency({ auth: { agencyId: 9 }, body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.body).toEqual({ error: "Forbidden" });
    });

    test("400 when changing password without current", async () => {
      sql.mockResolvedValueOnce([{ id: 1, login_id_hash: "x" }]);
      const res = createRes();
      await updateAgency(
        { auth: { agencyId: 1 }, body: { new_login_id_hash: "new" } },
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({
        error: "Current password is required to change password.",
      });
    });

    test("401 when current password mismatch", async () => {
      sql.mockResolvedValueOnce([{ id: 1, login_id_hash: "hash" }]);
      bcrypt.compare.mockResolvedValueOnce(false);

      const res = createRes();
      await updateAgency(
        {
          auth: { agencyId: 1 },
          body: { new_login_id_hash: "new", current_login_id_hash: "wrong" },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body).toEqual({ error: "Invalid current password" });
    });

    test("200 updates fields without password change (valid phone/email)", async () => {
      sql
        .mockResolvedValueOnce([
          {
            id: 1,
            login_id_hash: "hash",
            agency_name: "Old",
            phone: "0123456",
            agency_email: "a@b.c",
            website: "",
          },
        ])
        .mockResolvedValueOnce([
          {
            id: 1,
            agency_name: "New",
            agency_email: "e@x.com",
            phone: "0123456",
            logo_url: null,
            website: "w",
          },
        ]);

      const res = createRes();
      await updateAgency(
        {
          auth: { agencyId: 1 },
          body: {
            agency_name: "New",
            agency_email: "e@x.com",
            phone: "0123456", // >= 7 chars to satisfy validation
            website: "w",
          },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual(
        expect.objectContaining({ id: 1, agency_name: "New", phone: "0123456" })
      );
    });

    test("200 with password change path", async () => {
      sql
        .mockResolvedValueOnce([
          {
            id: 1,
            login_id_hash: "oldHash",
            agency_name: "Old",
            phone: "0123456",
            agency_email: "a@b.c",
            website: "",
          },
        ]) // SELECT *
        .mockResolvedValueOnce([
          {
            id: 1,
            agency_name: "Old",
            agency_email: "a@b.c",
            phone: "0123456",
            logo_url: null,
            website: "",
          },
        ]); // UPDATE RETURNING

      bcrypt.compare.mockResolvedValueOnce(true);
      bcrypt.genSalt.mockResolvedValueOnce("salt");
      bcrypt.hash.mockResolvedValueOnce("newHash");

      const res = createRes();
      await updateAgency(
        {
          auth: { agencyId: 1 },
          body: {
            current_login_id_hash: "curr",
            new_login_id_hash: "new",
          },
        },
        res
      );
      expect(bcrypt.compare).toHaveBeenCalledWith("curr", "oldHash");
      expect(bcrypt.hash).toHaveBeenCalledWith("new", "salt");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("oops"));
      const res = createRes();
      await updateAgency({ auth: { agencyId: 1 }, body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Failed to update agency" });
    });
  });

  // ---------- deleteAgency ----------
  describe("deleteAgency", () => {
    test("200 on success", async () => {
      sql.mockResolvedValueOnce({ rowCount: 1 });
      const res = createRes();
      await deleteAgency({ auth: { agencyId: 3 } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("404 when not found", async () => {
      sql.mockResolvedValueOnce({ rowCount: 0 });
      const res = createRes();
      await deleteAgency({ auth: { agencyId: 3 } }, res);
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("bad"));
      const res = createRes();
      await deleteAgency({ auth: { agencyId: 3 } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Failed to delete agency" });
    });
  });

  // ---------- fetchAgencyEnquiries ----------
  describe("fetchAgencyEnquiries", () => {
    test("200 with data + meta", async () => {
      sql
        .mockResolvedValueOnce([
          {
            id: 1,
            message: "hi",
            created_at: "2024-01-01",
            status: "pending",
            property_id: 10,
            property_location: "Belfast",
            property_title: "Nice",
            user_full_name: "T U",
            user_email: "t@u.com",
          },
        ])
        .mockResolvedValueOnce([{ count: 1 }]);

      const res = createRes();
      await fetchAgencyEnquiries(
        { params: { id: "7" }, query: { page: "2", limit: "5" } },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          page: 2,
          limit: 5,
          totalCount: 1,
        })
      );
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("500 on error", async () => {
      sql.mockRejectedValueOnce(new Error("x"));
      const res = createRes();
      await fetchAgencyEnquiries({ params: { id: "7" }, query: {} }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({
        success: false,
        error: "Failed to fetch enquiries",
      });
    });
  });

  // ---------- updateEnquiryStatus ----------
  describe("updateEnquiryStatus", () => {
    test("400 on invalid status", async () => {
      const res = createRes();
      await updateEnquiryStatus(
        {
          auth: { agencyId: 1, role: "agent" },
          params: { agencyId: "1", enquiryId: "9" },
          body: { status: "nope" },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ success: false, error: "Invalid status" });
    });

    test("400 on bad ids", async () => {
      const res = createRes();
      await updateEnquiryStatus(
        {
          auth: { agencyId: 1, role: "agent" },
          params: { agencyId: "abc", enquiryId: "xyz" },
          body: { status: "accepted" },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("404 when no row returned", async () => {
      sql.mockResolvedValueOnce([undefined]);
      const res = createRes();
      await updateEnquiryStatus(
        {
          auth: { agencyId: 2, role: "agent" },
          params: { agencyId: "2", enquiryId: "10" },
          body: { status: "declined" },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.body).toEqual({ success: false, error: "Enquiry not found" });
    });

    test("200 with updated data", async () => {
      sql.mockResolvedValueOnce([
        {
          id: 10,
          status: "accepted",
          agency_id: 2,
          property_id: 99,
          created_at: "2024-01-01",
        },
      ]);
      const res = createRes();
      await updateEnquiryStatus(
        {
          auth: { agencyId: 2, role: "agent" },
          params: { agencyId: "2", enquiryId: "10" },
          body: { status: "accepted" },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          id: 10,
          status: "accepted",
          agencyId: 2,
          propertyId: 99,
          createdAt: "2024-01-01",
        },
      });
    });

    test("500 on DB error", async () => {
      sql.mockRejectedValueOnce(new Error("db"));
      const res = createRes();
      await updateEnquiryStatus(
        {
          auth: { agencyId: 2, role: "agent" },
          params: { agencyId: "2", enquiryId: "10" },
          body: { status: "accepted" },
        },
        res
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({
        success: false,
        error: "Failed to update status",
      });
    });
  });
});
