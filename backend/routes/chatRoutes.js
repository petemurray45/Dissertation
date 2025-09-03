import express from "express";
import { botChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", botChat);

export default router;
