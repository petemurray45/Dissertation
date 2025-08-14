import express from "express";
import { agencyLogin } from "../controllers/agencyController.js";
import { registerAgency } from "../controllers/agencyController.js";
import { fetchPropertyByAgency } from "../controllers/agencyController.js";
import { getAgencyMe } from "../controllers/agencyController.js";
import { ensureSelfOrAdmin } from "../middleware/guards.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { listAgencies } from "../controllers/agencyController.js";
const router = express.Router();

router.post("/registerAgency", registerAgency);
router.post("/agencyLogin", agencyLogin);
router.get(
  "/:id/agencyProperties",
  requireAuth("agent", "admin"),
  ensureSelfOrAdmin,
  fetchPropertyByAgency
);
router.get("/agencies", requireAuth("admin"), listAgencies);
router.get("/me", requireAuth("agent"), getAgencyMe);

export default router;
