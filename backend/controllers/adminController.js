import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await sql`SELECT * FROM admins WHERE username = ${username}`;

    if (!admin.length)
      return res.status(401).json({ error: "Invalid Credentials" });

    const valid = await bcrypt.compare(password, admin[0].password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid Credentials" });

    const token = jwt.sign(
      { id: admin[0].id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2hr" }
    );
    res.json({
      token,
      admin: { id: admin[0].id, username: admin[0].username },
    });
  } catch (err) {
    console.error("Admin login error", err);
    res.status(500).json({ error: "Server error" });
  }
};
