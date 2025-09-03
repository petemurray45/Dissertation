import express from "express";

import { getAllProperties } from "../controllers/propertyControllers.js";
import { createProperty } from "../controllers/propertyControllers.js";
import { getProperty } from "../controllers/propertyControllers.js";
import { updateProperty } from "../controllers/propertyControllers.js";
import { deleteProperty } from "../controllers/propertyControllers.js";
import { getPropertiesWithTravelTime } from "../controllers/propertyControllers.js";
import { getPlaces } from "../controllers/propertyControllers.js";
import { insertEnquiries } from "../controllers/propertyControllers.js";
import { getEnquiries } from "../controllers/propertyControllers.js";
import { searchWithRadius } from "../controllers/propertyControllers.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { canManageProperty } from "../middleware/guards.js";
import { attachAgencyOnCreate } from "../middleware/guards.js";

const router = express.Router();

router.post("/travel-time", getPropertiesWithTravelTime);
router.get("/", getAllProperties);

router.get("/places", getPlaces);
router.post("/enquiries", insertEnquiries);
router.get("/enquiries", getEnquiries);
router.get("/search", searchWithRadius);

// protected

router.post(
  "/",
  requireAuth("admin", "agent"),
  attachAgencyOnCreate,
  createProperty
);

router.put(
  "/:id",
  requireAuth("admin", "agent"),
  canManageProperty,
  updateProperty
);
router.delete(
  "/:id",
  requireAuth("admin", "agent"),
  canManageProperty,
  deleteProperty
);

router.get("/:id", getProperty);

export default router;
