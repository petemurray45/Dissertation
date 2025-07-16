import express from "express";
import { addToLikes } from "../controllers/userControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkLikes } from "../controllers/userControllers.js";
import { getAllLikedProperties } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/likes", authenticate, addToLikes);
router.get("/checkLikes", authenticate, checkLikes);
router.get("/getLikes", getAllLikedProperties);

export default router;
