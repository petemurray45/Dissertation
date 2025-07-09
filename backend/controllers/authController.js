import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  console.log("REGISTER INPUT", { name, email, hashed });

  try {
    const result =
      await sql`INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (${name}, ${email}, ${hashed}, 'user', NOW()) RETURNING id, email`;
    if (!result.rows || result.rows.length === 0) {
      console.error("Register error: no rows returned");
      return res.status(500).json({ error: "Failed to register user" });
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2hr",
    });
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
  const user = result.rows[0];
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return res.status(400).json({ error: "Invalud email or password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
};
