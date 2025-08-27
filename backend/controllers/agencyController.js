import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

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
  const paramId = Number(req.params.id);

  console.log("=== Fetch Property Debug ===");
  console.log("req.auth:", req.auth);
  console.log("req.params.id:", req.params.id);
  console.log("============================");

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 6);
  const offset = (page - 1) * limit;

  try {
    const properties = await sql`
      SELECT *
      FROM properties
      WHERE agency_id = ${paramId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [{ count: totalCount }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM properties
      WHERE agency_id = ${paramId};
    `;

    const propertyIds = properties.map((p) => Number(p.id));
    if (propertyIds.length === 0) {
      return res.json({ properties: [], totalCount });
    }

    const images = await sql`
      SELECT property_id, image_url
      FROM images
      WHERE property_id = ANY(${propertyIds}::integer[])
      ORDER BY property_id, id;
    `;

    const imgsByProp = new Map();
    for (const row of images) {
      const pid = Number(row.property_id);
      if (!imgsByProp.has(pid)) imgsByProp.set(pid, []);
      imgsByProp.get(pid).push(row.image_url);
    }

    const propertiesWithImages = properties.map((p) => ({
      ...p,
      imageUrls: imgsByProp.get(Number(p.id)) ?? [],
    }));

    return res.json({
      properties: propertiesWithImages,
      totalCount,
      page,
      limit,
    });
  } catch (err) {
    console.error("Error fetching agency properties", err);
    return res.status(500).json({ error: "Failed to fetch properties" });
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

  console.log("updateAgency agencyId=", req.auth?.agencyId);
  console.log("updateAgency body.logo_url=", req.body?.logo_url);

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
    logo_url = ${logo_url ?? agency.logo_url},
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
    const { rowCount } = await sql`DELETE FROM agencies WHERE id = ${agencyId}`;
    if (rowCount === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (err) {
    console.error("Delete agency error", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const fetchAgencyEnquiries = async (req, res) => {
  const agencyId = Number(req.params.id);
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  try {
    const enquiries = await sql`
      SELECT
        e.id,
        e.message,
        e.created_at,
        e.status,
        e.property_id,
        p.location AS property_location,
        p.title    AS property_title,
        COALESCE(u.full_name, e.full_name) AS user_full_name,
        COALESCE(u.email, e.email)         AS user_email
      FROM enquiries e
      JOIN properties p ON p.id = e.property_id
      LEFT JOIN users u ON u.id = e.user_id
      WHERE e.agency_id = ${agencyId}
      ORDER BY e.created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM enquiries
      WHERE agency_id = ${agencyId};
    `;

    const data = enquiries.map((row) => ({
      id: row.id,
      message: row.message,
      createdAt: row.created_at,
      status: row.status,
      propertyId: row.property_id,
      propertyLocation: row.property_location,
      propertyTitle: row.property_title,
      userFullName: row.user_full_name,
      userEmail: row.user_email,
    }));

    return res.status(200).json({
      success: true,
      data: enquiries,
      page,
      limit,
      totalCount: count,
    });
  } catch (err) {
    console.error("Fetch agency enquiries error", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch enquiries",
    });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  const agencyIdFromToken = req.auth?.agencyId;
  const agencyIdParam = req.params.agencyId;

  const agencyId =
    req.auth?.role === "admin"
      ? Number(agencyIdParam)
      : Number(agencyIdFromToken);

  const enquiryId = Number(req.params.enquiryId);
  const { status } = req.body;

  if (!["accepted", "declined", "pending"].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status" });
  }

  if (!Number.isFinite(agencyId) || !Number.isFinite(enquiryId)) {
    console.warn("Bad params for updateEnquiryStatus:", {
      agencyIdParam,
      agencyIdFromToken,
      agencyId,
      enquiryIdParam: req.params.enquiryId,
      enquiryId,
    });
    return res
      .status(400)
      .json({ success: false, error: "Invalid agencyId or enquiryId" });
  }

  try {
    const [row] = await sql`
      UPDATE enquiries
      SET status = ${status}
      WHERE id = ${enquiryId} AND agency_id = ${agencyId}
      RETURNING id, status, agency_id, property_id, created_at;
    `;

    if (!row) {
      return res
        .status(404)
        .json({ success: false, error: "Enquiry not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: row.id,
        status: row.status,
        agencyId: row.agency_id,
        propertyId: row.property_id,
        createdAt: row.created_at,
      },
    });
  } catch (err) {
    console.error("Update enquiry status error", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update status" });
  }
};
