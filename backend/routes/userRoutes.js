import express from "express";
import { addToLikes } from "../controllers/userControllers.js";
import { authenticate, requireAuth } from "../middleware/authMiddleware.js";
import { checkLikes } from "../controllers/userControllers.js";
import { getAllLikedProperties } from "../controllers/userControllers.js";
import { removeLike } from "../controllers/userControllers.js";
import { getNotes } from "../controllers/userControllers.js";
import { addNote } from "../controllers/userControllers.js";
import { deleteNote } from "../controllers/userControllers.js";
import { getAllNotes } from "../controllers/userControllers.js";
import { updateProfile } from "../controllers/userControllers.js";
import { getEnquiries } from "../controllers/propertyControllers.js";

const router = express.Router();

// likes
router.get("/likes", requireAuth("user"), checkLikes);
router.post("/likes", requireAuth("user"), addToLikes);
router.get("/getLikes", requireAuth("user"), getAllLikedProperties);
router.delete("/likes", requireAuth("user"), removeLike);

//enquiries
router.get("/enquiries", requireAuth("user"), getEnquiries);

// notes
router.post("/notes", requireAuth("user"), addNote);
router.post("/notes/:property_id", requireAuth("user"), addNote);
router.get("/notes/:property_id", requireAuth("user"), getNotes);
router.get("/notes", requireAuth("user"), getAllNotes);
router.delete("/notes/:note_id", requireAuth("user"), deleteNote);

//profile
router.patch("/profile/:id", requireAuth("user"), updateProfile);

export default router;
