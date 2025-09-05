import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password, photoUrl } = req.body;
  console.log("REQ.BODY for register:", req.body);

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result =
      await sql`INSERT INTO users (full_name, email, password_hash, role, photo_url, created_at) VALUES (${name}, ${email}, ${hashed}, 'user', ${photoUrl || null}, NOW()) RETURNING id, full_name, email, photo_url`;
    let user;

    if (Array.isArray(result) && result.length > 0) {
      user = result[0];
      console.log("Extracted user object:", user);
    } else {
      console.error(
        "Register error: No user object returned in array after insert.",
        result
      );
      return res
        .status(500)
        .json({ error: "Failed to register user (no data returned)." });
    }

    if (!user || !user.id) {
      console.error(
        "Register error: User object or ID is truly invalid (after extraction).",
        user
      );
      return res.status(500).json({
        error: "Failed to register user (invalid ID after extraction).",
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.full_name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        photoUrl: user.photo_url ?? null,
      },
    });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "User already exists" });
    } else {
      console.error("Resgister error", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });
    console.log("User in login:", user);

    // creates JWT token with key details for navigating system
    const token = jwt.sign(
      { id: user.id, role: "user", name: user.full_name, email: user.email },
      // jwt secret stored in .env
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    console.log("JWT_SECRET in login:", process.env.JWT_SECRET);
    // full user object returned with token attached
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        role: "user",
        email: user.email,
        photoUrl: user.photo_url ?? null,
      },
    });
  } catch (err) {
    console.error("Login Error");
    res.status(500).json({
      error: "Invalid user details",
    });
  }
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const rows = await sql`SELECT * FROM admins WHERE username = ${username}`;
  const admin = rows[0];
  if (!admin) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2hr" }
  );
  return res.json({
    token,
    user: { id: admin.id, username: admin.username, role: "admin" },
  });
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await sql`
      SELECT id, full_name, email, photo_url
      FROM users
      WHERE id = ${decoded.id}
    `;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        photoUrl: user.photo_url ?? null,
      },
    });
  } catch (err) {
    console.error("Error in /me", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
