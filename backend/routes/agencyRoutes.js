import express from "express";
import { agencyLogin } from "../controllers/agencyController.js";
import { registerAgency } from "../controllers/agencyController.js";
import { fetchPropertyByAgency } from "../controllers/agencyController.js";
import { getAgencyMe } from "../controllers/agencyController.js";
import { ensureSelfOrAdmin } from "../middleware/guards.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { listAgencies } from "../controllers/agencyController.js";
import { updateAgency } from "../controllers/agencyController.js";
import { deleteAgency } from "../controllers/agencyController.js";
import { fetchAgencyEnquiries } from "../controllers/agencyController.js";
import { updateEnquiryStatus } from "../controllers/agencyController.js";
const router = express.Router();

router.post("/registerAgency", registerAgency);
router.post("/agencyLogin", agencyLogin);
router.get(
  "/:id/agencyProperties",
  requireAuth("agent", "admin"),
  ensureSelfOrAdmin,
  fetchPropertyByAgency
);
router.get("/agencies", requireAuth("admin", "agent"), listAgencies);
router.get("/me", requireAuth("agent"), getAgencyMe);
router.put("/me", requireAuth("agent", "admin"), updateAgency);
router.delete("/me", requireAuth("agent"), deleteAgency);
router.get(
  "/:id/enquiries",
  requireAuth("admin", "agent"),
  ensureSelfOrAdmin,
  fetchAgencyEnquiries
);
router.put(
  "/:id/enquiries/:enquiryId/status",
  requireAuth("admin", "agent"),
  ensureSelfOrAdmin,
  updateEnquiryStatus
);

export default router;
