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
  default: { compare: jest.fn() },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: jest.fn(), verify: jest.fn() },
}));

const { sql } = await import("../../../backend/config/db.js");
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;
const { adminLogin, adminMe } = await import(
  "../../../backend/controllers/adminController.js"
);

// --- small res helper ---
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

describe("adminLogin", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "test-secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("401 when username not found", async () => {
    sql.mockResolvedValueOnce([]);

    const req = { body: { username: "nope", password: "pw" } };
    const res = createRes();

    await adminLogin(req, res);

    expect(sql).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Credentials" });
  });

  it("401 when password mismatch", async () => {
    sql.mockResolvedValueOnce([
      { id: 1, username: "admin", password_hash: "hashed" },
    ]);
    bcrypt.compare.mockResolvedValueOnce(false);

    const req = { body: { username: "admin", password: "bad" } };
    const res = createRes();

    await adminLogin(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith("bad", "hashed");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Credentials" });
  });

  it("200 with token+user when valid", async () => {
    sql.mockResolvedValueOnce([
      { id: 1, username: "admin", password_hash: "hashed" },
    ]);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce("token-123");

    const req = { body: { username: "admin", password: "good" } };
    const res = createRes();

    await adminLogin(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, username: "admin", role: "admin" },
      "test-secret",
      { expiresIn: "2h" }
    );
    expect(res.json).toHaveBeenCalledWith({
      token: "token-123",
      user: { id: 1, username: "admin", role: "admin" },
    });
  });
});

describe("adminMe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("401 when no token", async () => {
    const req = { headers: { authorization: "" } };
    const res = createRes();

    await adminMe(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token" });
  });

  it("403 when role is not admin", async () => {
    const req = { headers: { authorization: "Bearer abc" } };
    const res = createRes();
    jwt.verify.mockReturnValueOnce({ id: 1, role: "user" });

    await adminMe(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
  });

  it("200 with user when valid", async () => {
    const req = { headers: { authorization: "Bearer abc" } };
    const res = createRes();
    jwt.verify.mockReturnValueOnce({ id: 1, role: "admin" });
    sql.mockResolvedValueOnce([{ id: 1, username: "admin" }]);

    await adminMe(req, res);

    expect(res.json).toHaveBeenCalledWith({
      user: { id: 1, username: "admin", role: "admin" },
    });
  });

  it("401 when token invalid (throws)", async () => {
    const req = { headers: { authorization: "Bearer bad" } };
    const res = createRes();
    jwt.verify.mockImplementationOnce(() => {
      throw new Error("invalid");
    });

    await adminMe(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });
});
