import express from "express";
import { agencyLogin } from "../controllers/agencyController.js";
import { registerAgency } from "../controllers/agencyController.js";
import { authenticateAgency } from "../middleware/authMiddleware.js";
import { fetchPropertyByAgency } from "../controllers/agencyController.js";
const router = express.Router();

router.post("/registerAgency", registerAgency);
router.post("/agencyLogin", agencyLogin);
router.get("/:id/agencyProperties", authenticateAgency, fetchPropertyByAgency);

export default router;
