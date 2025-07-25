import express from "express";
import { addToLikes } from "../controllers/userControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkLikes } from "../controllers/userControllers.js";
import { getAllLikedProperties } from "../controllers/userControllers.js";
import { removeLike } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/likes", authenticate, addToLikes);
router.get("/checkLikes", checkLikes);
router.get("/getLikes", authenticate, getAllLikedProperties);
router.delete("/removelike", authenticate, removeLike);

export default router;
