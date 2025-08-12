export const ensureSelfOrAdmin = (req, res, next) => {
  const { role, agencyId } = req.auth || {};
  if (role === "admin") return next();
  if (String(req.params.id) !== String(agencyId)) {
    return res
      .status(403)
      .json({ error: "Forbidden: Cannot access another agencies data." });
  }
  next();
};

export const canManageProperty = async (req, res, next) => {
  const { role, agencyId } = req.auth || {};
  if (role === "admin") return next();
  const { propertyId } = req.params.id;
  const rows =
    await sql`SELECT agency_id FROM properties WHERE id = ${propertyId}`;
  const property = rows[0];

  if (!property) return res.status(404).json({ error: "Property not found." });
  if (String(property.agency_id) !== String(agencyId)) {
    return res.status(403).json({ error: "Forbidden: Not your property." });
  }
  next();
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
