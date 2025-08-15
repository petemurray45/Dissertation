import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";
import { login } from "./authController.js";
import e from "cors";

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
  console.log("=== Fetch Property Debug ===");
  console.log("req.auth:", req.auth); // what authenticateAgency put here
  console.log("req.params.id:", req.params.id); // from URL :id
  console.log("============================");

  try {
    const result =
      await sql`SELECT * FROM properties WHERE agency_id = ${id} ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching agency properties", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

export const getAgencyMe = async (req, res) => {
  try {
    if (!req.auth?.agencyId) return res.status(401).json({ error: "No auth" });
    const { agencyId } = req.auth;
    const rows =
      await sql`SELECT id, agency_name, agency_email, phone, logo_url, created_at, updated_at, website FROM agencies WHERE id = ${agencyId} LIMIT 1`;
    if (rows.length === 0)
      return res.status(404).json({ error: "Agency not found" });

    const agency = rows[0];
    return res.json({ agency });
  } catch (err) {
    console.error("Error in agency/me", err);
    return res.status(500).json({ error: "Failed to fetch agency" });
  }
};

export const listAgencies = async (req, res) => {
  try {
    const rows = await sql`
        SELECT id, agency_name FROM
        agencies
        ORDER BY agency_name ASC`;
    res.json({ agencies: rows });
  } catch (err) {
    console.error("Error listing agencies", err);
    res.status(500).json({ error: "Failed to fetch agencies" });
  }
};

export const updateAgency = async (req, res) => {
  const {
    agency_name,
    agency_email,
    phone,
    logo_url,
    current_login_id_hash,
    new_login_id_hash,
    website,
  } = req.body;
  const { agencyId } = req.auth;

  try {
    const response = await sql`SELECT * FROM agencies WHERE id = ${agencyId}`;
    const agency = response[0];

    if (!agency) {
      return res.status(404).json({ error: "Agency not found." });
    }

    let login_id_hashed = agency.login_id_hash;
    if (new_login_id_hash) {
      if (!current_login_id_hash) {
        return res
          .status(400)
          .json({ error: "Current password is required to change password." });
      }

      const passwordMatch = await bcrypt.compare(
        current_login_id_hash,
        agency.login_id_hash
      );
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      const salt = await bcrypt.genSalt(10);
      login_id_hashed = await bcrypt.hash(new_login_id_hash, salt);
    }

    const [updatedAgency] = await sql`
    UPDATE agencies SET
    agency_name = ${agency_name || agency.agency_name},
    agency_email = ${agency_email || agency.agency_email},
    login_id_hash = ${login_id_hashed || agency.login_id_hash},
    phone = ${phone || agency.phone},
    logo_url = ${logo_url || agency.logo_url},
    website = ${website || agency.website}
    WHERE id = ${agencyId}
    RETURNING id, agency_name, agency_email, phone, logo_url, website
    `;
    res.status(200).json(updatedAgency);
  } catch (err) {
    console.error("Update agency error", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAgency = async (req, res) => {
  const { agencyId } = req.auth;
  try {
    await sql`DELETE FROM agencies WHERE id = ${agencyId}`;
    res.status(204).send;
  } catch (err) {
    console.error("Delete agency error", err);
    res.status(500).json({ error: "Server error" });
  }
};
