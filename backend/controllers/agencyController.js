import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";
import { login } from "./authController.js";

export const registerAgency = async (req, res) => {
  const { name, website, email, phone, loginId } = req.body;

  try {
    const hashedLoginId = await bcrypt.hash(loginId, 10);
    const result =
      await sql`INSERT INTO agencies (name, website, email, phone, login_id_hash) VALUES (${name}, ${website}, ${email}, ${phone}, ${loginId}) RETURNING id, name, email, website, phone`;

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
  const { name, loginId } = req.body;

  try {
    const result = await sql`SELECT * FROM agencies WHERE name = ${name}`;
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
