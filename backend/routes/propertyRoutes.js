import express from "express";

import { getAllProperties } from "../controllers/propertyControllers.js";
import { createProperty } from "../controllers/propertyControllers.js";
import { getProperty } from "../controllers/propertyControllers.js";
import { updateProperty } from "../controllers/propertyControllers.js";
import { deleteProperty } from "../controllers/propertyControllers.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/:id", getProperty);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
