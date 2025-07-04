import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await sql(
      `INSERT INTO users (full_name, email, password_hash) VALUES (${name}, ${email}, ${hashed}) RETURNING id, email`
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = result.rows[0];
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(400).json({ error: "Invalud email or password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
};
