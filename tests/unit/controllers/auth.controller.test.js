import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterAll,
} from "@jest/globals";

jest.unstable_mockModule("../../../backend/config/db.js", () => ({
  sql: jest.fn(),
}));
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
    genSalt: jest.fn(),
  },
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

// import mocks + module under test
const { sql } = await import("../../../backend/config/db.js");
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;

const { register, login, adminLogin, getMe } = await import(
  "../../../backend/controllers/authController.js"
);

// helpers
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
  return res;
}

describe("auth controller", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "test-secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("register", () => {
    it("201 on success with token + user", async () => {
      bcrypt.hash.mockResolvedValueOnce("hashedpw");
      // DB returns one row like controller expects
      sql.mockResolvedValueOnce([
        { id: 42, full_name: "Alice", email: "a@b.com", photo_url: null },
      ]);
      jwt.sign.mockReturnValueOnce("jwt-token");

      const req = {
        body: {
          name: "Alice",
          email: "a@b.com",
          password: "pw123",
          photoUrl: null,
        },
      };
      const res = createRes();

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("pw123", 10);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 42, name: "Alice", email: "a@b.com" },
        "test-secret",
        { expiresIn: "2h" }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.body).toEqual({
        token: "jwt-token",
        user: {
          id: 42,
          name: "Alice",
          email: "a@b.com",
          photoUrl: null,
        },
      });
    });

    it("400 when unique violation (23505)", async () => {
      const err = new Error("duplicate");
      err.code = "23505";
      sql.mockRejectedValueOnce(err);

      const req = { body: { name: "Bob", email: "b@b.com", password: "pw" } };
      const res = createRes();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ error: "User already exists" });
    });

    it("500 on unexpected error", async () => {
      sql.mockRejectedValueOnce(new Error("boom"));

      const req = { body: { name: "C", email: "c@c.com", password: "pw" } };
      const res = createRes();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({ error: "Something went wrong" });
    });
  });

  describe("login", () => {
    it("400 when user not found", async () => {
      sql.mockResolvedValueOnce([]);

      const req = { body: { email: "missing@x.com", password: "pw" } };
      const res = createRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ error: "Invalid email or password" });
    });

    it("400 when password mismatch", async () => {
      sql.mockResolvedValueOnce([
        { id: 1, full_name: "U", email: "u@x.com", password_hash: "hash" },
      ]);
      bcrypt.compare.mockResolvedValueOnce(false);

      const req = { body: { email: "u@x.com", password: "bad" } };
      const res = createRes();

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("bad", "hash");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ error: "Invalid email or password" });
    });

    it("200 when valid (token + user)", async () => {
      sql.mockResolvedValueOnce([
        {
          id: 9,
          full_name: "Dana",
          email: "d@x.com",
          password_hash: "hash",
          photo_url: "pic.png",
        },
      ]);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce("user-jwt");

      const req = { body: { email: "d@x.com", password: "good" } };
      const res = createRes();

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 9, role: "user", name: "Dana", email: "d@x.com" },
        "test-secret",
        { expiresIn: "2h" }
      );
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        token: "user-jwt",
        user: {
          id: 9,
          name: "Dana",
          role: "user",
          email: "d@x.com",
          photoUrl: "pic.png",
        },
      });
    });
  });

  describe("adminLogin", () => {
    it("400 when admin not found", async () => {
      sql.mockResolvedValueOnce([]);

      const req = { body: { username: "nope", password: "x" } };
      const res = createRes();

      await adminLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ error: "Invalid credentials" });
    });

    it("400 when admin password mismatch", async () => {
      sql.mockResolvedValueOnce([
        { id: 2, username: "root", password_hash: "hash" },
      ]);
      bcrypt.compare.mockResolvedValueOnce(false);

      const req = { body: { username: "root", password: "bad" } };
      const res = createRes();

      await adminLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ error: "Invalid credentials" });
    });

    it("200 when valid admin", async () => {
      sql.mockResolvedValueOnce([
        { id: 3, username: "root", password_hash: "hash" },
      ]);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce("admin-jwt");

      const req = { body: { username: "root", password: "good" } };
      const res = createRes();

      await adminLogin(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 3, username: "root", role: "admin" },
        "test-secret",
        { expiresIn: "2hr" }
      );
      expect(res.body).toEqual({
        token: "admin-jwt",
        user: { id: 3, username: "root", role: "admin" },
      });
    });
  });

  describe("getMe", () => {
    it("401 when no token", async () => {
      const req = { headers: { authorization: "" } };
      const res = createRes();

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body).toEqual({ message: "No token provided" });
    });

    it("401 when invalid token", async () => {
      const req = { headers: { authorization: "Bearer bad.token" } };
      const res = createRes();

      jwt.verify.mockImplementationOnce(() => {
        throw new Error("bad token");
      });

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body).toEqual({ message: "Invalid token" });
    });

    it("404 when user not found", async () => {
      jwt.verify.mockReturnValueOnce({ id: 77 });
      sql.mockResolvedValueOnce([]); // no user

      const req = { headers: { authorization: "Bearer good.token" } };
      const res = createRes();

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("200 with user when valid", async () => {
      jwt.verify.mockReturnValueOnce({ id: 12 });
      sql.mockResolvedValueOnce([
        { id: 12, full_name: "Pat", email: "p@x.com", photo_url: null },
      ]);

      const req = { headers: { authorization: "Bearer ok.token" } };
      const res = createRes();

      await getMe(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        user: { id: 12, name: "Pat", email: "p@x.com", photoUrl: null },
      });
    });
  });
});
