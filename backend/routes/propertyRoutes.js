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

const router = express.Router();

//router.get("/time", getTravelTime);
router.post("/travel-time", getPropertiesWithTravelTime);
router.get("/", getAllProperties);
router.post("/", createProperty);
router.get("/places", getPlaces);
router.post("/insert-enquiry", insertEnquiries);
router.get("/get-enquiry", getEnquiries);
router.get("/search", searchWithRadius);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/:id", getProperty);

export default router;
