import express from "express";
import { addToLikes } from "../controllers/userControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkLikes } from "../controllers/userControllers.js";
import { getAllLikedProperties } from "../controllers/userControllers.js";
import { removeLike } from "../controllers/userControllers.js";
import { getNotes } from "../controllers/userControllers.js";
import { addNote } from "../controllers/userControllers.js";
import { deleteNote } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/likes", authenticate, addToLikes);
router.post("/addNote", authenticate, addNote);
router.get("/getNotes/:user_id/:property_id", authenticate, getNotes);
router.get("/checkLikes", checkLikes);
router.get("/getLikes", authenticate, getAllLikedProperties);
router.delete("/removelike", authenticate, removeLike);
router.delete("/deleteNote/:note_id", authenticate, deleteNote);

export default router;
