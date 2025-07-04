import express from "express";
import { register, login } from "../controllers/authController.js";
const router = express.Router();

router.get("/login", login);
router.get("/register", register);

export default router;
