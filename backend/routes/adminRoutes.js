import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createAgency,
  adminListAgencies,
  adminDeleteAgency,
} from "../controllers/adminController.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/agencies", requireAuth("admin"), adminListAgencies);
router.post("/agencies", requireAuth("admin"), createAgency);
router.delete("/agencies/:id", requireAuth("admin"), adminDeleteAgency);

export default router;
