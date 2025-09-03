import { sql } from "../config/db.js";

export const ensureSelfOrAdmin = (req, res, next) => {
  const { role, agencyId } = req.auth || {};
  const targetAgencyId = req.params.id || req.params.agencyId; //
  if (role === "admin") return next();
  if (
    role === "agent" &&
    agencyId &&
    String(agencyId) === String(targetAgencyId)
  ) {
    return next();
  }

  return res
    .status(403)
    .json({ error: "Forbidden: Cannot update this agency account" });
};

export const canManageProperty = async (req, res, next) => {
  const { role, agencyId } = req.auth || {};
  if (role === "admin") {
    return next();
  }

  if (role !== "agent" || !agencyId) {
    return res.status(403).json({
      error:
        "Forbidden: You do not have the right role to manage this property.",
    });
  }

  const propertyId = req.params.id;

  try {
    const rows =
      await sql`SELECT agency_id FROM properties WHERE id = ${propertyId}`;
    const property = rows[0];
    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }
    if (String(property.agency_id) !== String(agencyId)) {
      return res.status(403).json({
        error: "Forbidden: You can only manage your own agency's properties.",
      });
    }
    next();
  } catch (err) {
    console.error("Error in canManageProperty middleware:", err);
    return res
      .status(500)
      .json({ error: "Server error while checking permissions." });
  }
};

export const attachAgencyOnCreate = (req, res, next) => {
  const { role, agencyId } = req.auth || {};
  if (role === "admin") return next();

  if (req.body.agency_id && String(req.body.agency_id) !== String(agencyId)) {
    return res
      .status(403)
      .json({ error: "Forbidden: Cannot create for another agency" });
  }
  req.body.agency_id = agencyId;
  next();
};
