import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", getMe);

export default router;
