import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("REQ.BODY for register:", req.body);

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result =
      await sql`INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (${name}, ${email}, ${hashed}, 'user', NOW()) RETURNING id, email`;
    let user;

    // check if is array and contains at least one row
    if (Array.isArray(result) && result.length > 0) {
      user = result[0]; // Get the first (and only) user object from the array
      console.log("Extracted user object:", user); // Log the correctly extracted user object
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
        expiresIn: "2hr",
      }
    );
    res.status(201).json({ user, token });
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
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = result[0];
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return res.status(400).json({ error: "Invalid email or password" });
  console.log("User in login:", user);

  const token = jwt.sign(
    { id: user.id, name: user.full_name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  console.log("JWT_SECRET in login:", process.env.JWT_SECRET);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
    },
  });
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);
    console.log("SECRET USED:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT_SECRET in getMe:", process.env.JWT_SECRET);

    const result =
      await sql`SELECT id, full_name, email FROM users WHERE id = ${decoded.id}`;
    const user = result[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: { id: user.id, name: user.full_name, email: user.email },
    });
  } catch (err) {
    console.error("Error in /me", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
