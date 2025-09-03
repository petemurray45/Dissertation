// tests/unit/controllers/user.controller.test.js
import {
  jest,
  describe,
  it,
  beforeEach,
  beforeAll,
  afterAll,
  expect,
} from "@jest/globals";

// mock db and bcrypt before importing controller
jest.unstable_mockModule("../../../backend/config/db.js", () => ({
  sql: jest.fn(),
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    genSalt: jest.fn(),
    hash: jest.fn(),
  },
}));

// import mocked deps and controller exports
let sql;
let bcrypt;
let controller;

let {
  checkLikes,
  addToLikes,
  getAllLikedProperties,
  removeLike,
  addNote,
  getNotes,
  getAllNotes,
  deleteNote,
  updateProfile,
} = {};

beforeAll(async () => {
  ({ sql } = await import("../../../backend/config/db.js"));
  bcrypt = (await import("bcrypt")).default;
  controller = await import("../../../backend/controllers/userControllers.js");

  ({
    checkLikes,
    addToLikes,
    getAllLikedProperties,
    removeLike,
    addNote,
    getNotes,
    getAllNotes,
    deleteNote,
    updateProfile,
  } = controller);
});

// minimal express style response
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

describe("user controller", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    sql.mockReset();
    bcrypt.genSalt.mockReset();
    bcrypt.hash.mockReset();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  // checkLikes
  it("checkLikes returns liked true when row exists", async () => {
    sql.mockResolvedValueOnce([{}]); // any row means liked
    const req = { query: { propertyId: "7" }, auth: { userId: 42 } };
    const res = createRes();

    await checkLikes(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ liked: true });
  });

  it("checkLikes returns 400 when missing params", async () => {
    const req = { query: {}, auth: {} };
    const res = createRes();

    await checkLikes(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/missing/i);
  });

  it("checkLikes returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("db"));
    const req = { query: { propertyId: "7" }, auth: { userId: 1 } };
    const res = createRes();

    await checkLikes(req, res);

    expect(res.statusCode).toBe(500);
  });

  // addToLikes
  it("addToLikes inserts like and returns 201", async () => {
    sql.mockResolvedValueOnce(undefined); // insert
    const req = { body: { propertyId: 9 }, auth: { userId: 3 } };
    const res = createRes();

    await addToLikes(req, res);

    expect(sql).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: "Property Liked" });
  });

  it("addToLikes returns 400 when missing params", async () => {
    const req = { body: {}, auth: {} };
    const res = createRes();

    await addToLikes(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/missing/i);
  });

  it("addToLikes handles db error without throwing", async () => {
    // this test ensures no throw and leaves status as default
    sql.mockRejectedValueOnce(new Error("db down"));
    const req = { body: { propertyId: 1 }, auth: { userId: 2 } };
    const res = createRes();

    await addToLikes(req, res);

    expect(res.status).not.toHaveBeenCalledWith(500);
    //  ensure it did not mark success either
    expect(res.json).toHaveBeenCalledTimes(0);
  });

  // getAllLikedProperties
  it("getAllLikedProperties returns list of liked ids", async () => {
    sql.mockResolvedValueOnce([{ property_id: 5 }, { property_id: 8 }]);
    const req = { auth: { userId: 77 } };
    const res = createRes();

    await getAllLikedProperties(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ liked: [5, 8] });
  });

  it("getAllLikedProperties returns 400 when not authorized", async () => {
    const req = { auth: {} };
    const res = createRes();

    await getAllLikedProperties(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("getAllLikedProperties returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("x"));
    const req = { auth: { userId: 9 } };
    const res = createRes();

    await getAllLikedProperties(req, res);

    expect(res.statusCode).toBe(500);
  });

  // removeLike
  it("removeLike accepts property id in body and returns 200", async () => {
    sql.mockResolvedValueOnce(undefined);
    const req = { body: { propertyId: 12 }, auth: { userId: 2 } };
    const res = createRes();

    await removeLike(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Property Unliked" });
  });

  it("removeLike accepts property id in query and returns 200", async () => {
    sql.mockResolvedValueOnce(undefined);
    const req = { query: { propertyId: "12" }, auth: { userId: 2 } };
    const res = createRes();

    await removeLike(req, res);

    expect(res.statusCode).toBe(200);
  });

  it("removeLike returns 400 when missing params", async () => {
    const req = { body: {}, auth: {} };
    const res = createRes();

    await removeLike(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("removeLike returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("boom"));
    const req = { body: { propertyId: 1 }, auth: { userId: 2 } };
    const res = createRes();

    await removeLike(req, res);

    expect(res.statusCode).toBe(500);
  });

  // addNote
  it("addNote inserts and returns 201", async () => {
    sql.mockResolvedValueOnce(undefined);
    const req = {
      body: { property_id: 5, content: "note" },
      auth: { userId: 9 },
    };
    const res = createRes();

    await addNote(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  it("addNote returns 400 on missing fields", async () => {
    const req = { body: {}, auth: { userId: 1 } };
    const res = createRes();

    await addNote(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("addNote returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("db"));
    const req = {
      body: { property_id: 5, content: "x" },
      auth: { userId: 2 },
    };
    const res = createRes();

    await addNote(req, res);

    expect(res.statusCode).toBe(500);
  });

  // getNotes
  it("getNotes returns notes for user and property", async () => {
    sql.mockResolvedValueOnce([{ id: 1, content: "a" }]);
    const req = { params: { property_id: "7" }, auth: { userId: 3 } };
    const res = createRes();

    await getNotes(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, content: "a" }]);
  });

  it("getNotes returns 400 when missing", async () => {
    const req = { params: {}, auth: {} };
    const res = createRes();

    await getNotes(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("getNotes returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("db"));
    const req = { params: { property_id: "3" }, auth: { userId: 2 } };
    const res = createRes();

    await getNotes(req, res);

    expect(res.statusCode).toBe(500);
  });

  // getAllNotes
  it("getAllNotes returns joined list", async () => {
    sql.mockResolvedValueOnce([
      { id: 1, content: "c", property_id: 5, location: "b", created_at: "t" },
    ]);
    const req = { auth: { userId: 4 } };
    const res = createRes();

    await getAllNotes(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 1, content: "c", property_id: 5, location: "b", created_at: "t" },
    ]);
  });

  it("getAllNotes returns 400 when no user", async () => {
    const req = { auth: {} };
    const res = createRes();

    await getAllNotes(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("getAllNotes returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("x"));
    const req = { auth: { userId: 9 } };
    const res = createRes();

    await getAllNotes(req, res);

    expect(res.statusCode).toBe(500);
  });

  // deleteNote
  it("deleteNote deletes note when owned", async () => {
    sql.mockResolvedValueOnce([{ id: 1 }]); // returning row means deleted
    const req = { params: { note_id: "11" }, auth: { userId: 5 } };
    const res = createRes();

    await deleteNote(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, message: "Note deleted" });
  });

  it("deleteNote returns 404 when not found", async () => {
    sql.mockResolvedValueOnce([]); // nothing deleted
    const req = { params: { note_id: "11" }, auth: { userId: 5 } };
    const res = createRes();

    await deleteNote(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("deleteNote returns 401 when unauthorized", async () => {
    const req = { params: { note_id: "11" }, auth: {} };
    const res = createRes();

    await deleteNote(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("deleteNote returns 500 on db error", async () => {
    sql.mockRejectedValueOnce(new Error("boom"));
    const req = { params: { note_id: "11" }, auth: { userId: 5 } };
    const res = createRes();

    await deleteNote(req, res);

    expect(res.statusCode).toBe(500);
  });

  // updateProfile
  it("updateProfile returns 401 when no user", async () => {
    const req = { auth: {}, body: {} };
    const res = createRes();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("updateProfile updates without password", async () => {
    sql.mockResolvedValueOnce([
      { id: 7, full_name: "a", email: "e", photo_url: "p" },
    ]);
    const req = {
      auth: { userId: 7 },
      body: { full_name: "a", email: "e", photoUrl: "p" },
    };
    const res = createRes();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual({
      id: 7,
      full_name: "a",
      email: "e",
      photo_url: "p",
    });
    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it("updateProfile hashes password when provided", async () => {
    bcrypt.genSalt.mockResolvedValueOnce("salt");
    bcrypt.hash.mockResolvedValueOnce("hashed");
    sql.mockResolvedValueOnce([
      { id: 9, full_name: "n", email: "m", photo_url: null },
    ]);

    const req = {
      auth: { userId: 9 },
      body: { password: "newpass" },
    };
    const res = createRes();

    await updateProfile(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("newpass", "salt");
    expect(res.statusCode).toBe(200);
  });

  it("updateProfile returns 404 when user not found", async () => {
    sql.mockResolvedValueOnce([]); // no rows
    const req = { auth: { userId: 1 }, body: {} };
    const res = createRes();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("updateProfile returns 409 on email conflict", async () => {
    const err = new Error("duplicate");
    err.code = "23505";
    sql.mockRejectedValueOnce(err);
    const req = { auth: { userId: 1 }, body: { email: "dup@example.com" } };
    const res = createRes();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/email/i);
  });

  it("updateProfile returns 500 on other error", async () => {
    sql.mockRejectedValueOnce(new Error("x"));
    const req = { auth: { userId: 1 }, body: {} };
    const res = createRes();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(500);
  });
});
