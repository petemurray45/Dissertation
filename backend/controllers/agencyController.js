import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";
import { login } from "./authController.js";

export const registerAgency = async (req, res) => {
  const { agency_name, agency_email, phone, loginId, website } = req.body;

  try {
    const hashedLoginId = await bcrypt.hash(loginId, 10);
    const result =
      await sql`INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website) VALUES (${agency_name}, ${agency_email}, ${phone}, ${hashedLoginId}, ${website}) RETURNING id, agency_name, agency_email, phone, website, logo_url`;

    const agency = result[0];
    const token = jwt.sign(
      {
        agencyId: agency.id,
        role: "agent",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(201).json({ token, agency });
  } catch (err) {
    console.error("Error registering agency", err);
    res.status(500).json({ error: "Failed to register agency" });
  }
};

export const agencyLogin = async (req, res) => {
  const { agency_name, loginId } = req.body;

  try {
    const result =
      await sql`SELECT * FROM agencies WHERE agency_name = ${agency_name}`;
    const agency = result[0];

    if (!agency) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(loginId, agency.login_id_hash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { agencyId: agency.id, role: "agent" },
      process.env.JWT_SECRET,
      { expiresIn: "2hr" }
    );
    res.json({ token, agency });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const fetchPropertyByAgency = async (req, res) => {
  const { id } = req.params;

  try {
    const result =
      await sql`SELECT * FROM properties WHERE agency_id = ${id} ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching agency properties", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};
