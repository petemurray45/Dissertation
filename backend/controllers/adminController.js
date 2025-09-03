import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const rows = await sql`SELECT * FROM admins WHERE username = ${username}`;

    if (!rows.length)
      return res.status(401).json({ error: "Invalid Credentials" });
    const admin = rows[0];
    console.log("Plain password from request:", password);
    console.log("Stored hash in DB:", admin.password_hash);
    const valid = await bcrypt.compare(password, admin.password_hash);
    console.log("Password match result:", valid);
    if (!valid) return res.status(401).json({ error: "Invalid Credentials" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      token,
      user: { id: admin.id, username: admin.username, role: "admin" },
    });
  } catch (err) {
    console.error("Admin login error", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const adminMe = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const rows = await sql`SELECT * FROM admins WHERE id = ${decoded.id}`;
    const admin = rows[0];
    if (!admin) return res.status(404).json({ error: "Not found" });
    return res.json({
      user: { id: admin.id, username: admin.username, role: "admin" },
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
