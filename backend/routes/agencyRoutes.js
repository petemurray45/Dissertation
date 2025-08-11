import express from "express";
import { agencyLogin } from "../controllers/agencyController.js";
import { registerAgency } from "../controllers/agencyController.js";
import { authenticateAgency } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registerAgency", authenticateAgency, registerAgency);
router.post("/agencyLogin", authenticateAgency, agencyLogin);

export default router;
