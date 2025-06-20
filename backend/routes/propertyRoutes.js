import express from "express";

import { getAllProperties } from "../controllers/propertyController.js";
import { createProperty } from "../controllers/propertyController.js";
import { getProperty } from "../controllers/propertyController.js";
import { updateProperty } from "../controllers/propertyController.js";
import { deleteProperty } from "../controllers/propertyController.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/:id", getProperty);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
