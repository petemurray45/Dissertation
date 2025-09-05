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
    res.status(200).json({
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

export const createAgency = async (req, res) => {
  const { agency_name, agency_email, phone, loginId, website, logo_url } =
    req.body || {};

  if (!agency_name || !agency_email || !loginId) {
    return res
      .status(400)
      .json({ error: "agency_name, agency_email and loginId are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const saltedhash = await bcrypt.hash(loginId, salt);

    const rows = await sql`
      INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website, logo_url)
      VALUES (${agency_name}, ${agency_email}, ${phone}, ${saltedhash}, ${website}, ${logo_url})
      RETURNING id, agency_name, agency_email, phone, website, logo_url, created_at, updated_at
    `;

    const agency = rows[0];

    return res.status(201).json(agency);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Agency already exists" });
    }
    console.error("adminCreateAgency error:", err);
    return res.status(500).json({ error: "Failed to create agency" });
  }
};

export const adminListAgencies = async (_req, res) => {
  try {
    const rows = await sql`
      SELECT id, agency_name, agency_email, phone, logo_url, website, created_at, updated_at
      FROM agencies
      ORDER BY agency_name ASC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error("adminListAgencies error:", err);
    return res.status(500).json({ error: "Failed to fetch agencies" });
  }
};

export const adminDeleteAgency = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ error: "Invalid id" });

  try {
    const rows = await sql`DELETE FROM agencies WHERE id = ${id} RETURNING id`;
    if (rows.length === 0)
      return res.status(404).json({ error: "Agency not found" });
    return res.status(200).json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error("adminDeleteAgency error:", err);
    return res.status(500).json({ error: "Failed to delete agency" });
  }
};
