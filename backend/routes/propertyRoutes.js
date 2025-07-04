import express from "express";

import { getAllProperties } from "../controllers/propertyControllers.js";
import { createProperty } from "../controllers/propertyControllers.js";
import { getProperty } from "../controllers/propertyControllers.js";
import { updateProperty } from "../controllers/propertyControllers.js";
import { deleteProperty } from "../controllers/propertyControllers.js";
import { getTravelTime } from "../controllers/propertyControllers.js";
import { getPropertiesWithTravelTime } from "../controllers/propertyControllers.js";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

//router.get("/time", getTravelTime);
router.get("/travelTime", getPropertiesWithTravelTime);
router.post("/login", login);
router.post("/register", register);
router.get("/", getAllProperties);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/:id", getProperty);
export default router;
