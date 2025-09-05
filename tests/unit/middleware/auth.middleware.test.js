import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

// mock jsonwebtoken before importing the middleware ---
let jwtVerifyMock;
jest.unstable_mockModule("jsonwebtoken", () => {
  jwtVerifyMock = jest.fn();
  return {
    default: { verify: jwtVerifyMock },
  };
});

// import the SUT after mocks
const { authenticate, requireAuth } = await import(
  "../../../backend/middleware/authMiddleware.js"
);
const jwt = (await import("jsonwebtoken")).default;

// helpers
const makeRes = () => {
  const res = {};
  res.statusCode = undefined;
  res.payload = undefined;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((obj) => {
    res.payload = obj;
    return res;
  });
  res.sendStatus = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  return res;
};

describe("auth middleware", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "test-secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("authenticate(allowedRoles?)", () => {
    it("returns 403 when header is missing/invalid scheme", () => {
      const req = { headers: {} };
      const res = makeRes();
      const next = jest.fn();

      authenticate()(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.payload).toEqual({
        error: "Missing or invalid Authentication header",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 when token is invalid/expired", () => {
      const req = { headers: { authorization: "Bearer badtoken" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockImplementation(() => {
        throw new Error("bad");
      });

      authenticate()(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("badtoken", "test-secret");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.payload).toEqual({ error: "Invalid or expired token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next when token is valid and no role restriction", () => {
      const req = { headers: { authorization: "Bearer good" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockReturnValue({ id: 1, role: "user" });

      authenticate()(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("good", "test-secret");
      expect(req.auth).toEqual({ id: 1, role: "user" });
      expect(next).toHaveBeenCalled();
    });

    it("returns 403 when role not allowed", () => {
      const req = { headers: { authorization: "Bearer good" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockReturnValue({ id: 2, role: "user" });

      authenticate(["admin", "agent"])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.payload).toEqual({ error: "Forbidden: Insufficient Role" });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next when role is allowed", () => {
      const req = { headers: { authorization: "Bearer good" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockReturnValue({ id: 3, role: "agent" });

      authenticate(["admin", "agent"])(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.auth).toEqual({ id: 3, role: "agent" });
    });
  });

  describe("requireAuth(...allowedRoles)", () => {
    it("returns 401 when no token", () => {
      const req = { headers: {} };
      const res = makeRes();
      const next = jest.fn();

      requireAuth()(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 403 when jwt.verify throws", () => {
      const req = { headers: { authorization: "Bearer nope" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockImplementation(() => {
        throw new Error("invalid");
      });

      requireAuth()(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 403 when role is not allowed", () => {
      const req = { headers: { authorization: "Bearer tok" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockReturnValue({ id: 9, role: "user" });

      requireAuth("admin", "agent")(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next and sets req.auth when allowed", () => {
      const req = { headers: { authorization: "Bearer tok" } };
      const res = makeRes();
      const next = jest.fn();

      jwtVerifyMock.mockReturnValue({ id: 7, role: "admin" });

      requireAuth("admin")(req, res, next);

      expect(req.auth).toEqual({ id: 7, role: "admin" });
      expect(next).toHaveBeenCalled();
    });
  });
});
