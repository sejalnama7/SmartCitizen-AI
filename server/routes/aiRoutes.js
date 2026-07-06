import { Router } from "express";
import { sendChatMessage } from "../controllers/aiController.js";

const router = Router();

// POST /api/ai/chat — body: { message: string, history?: Array<{ role, content }> }
router.post("/chat", sendChatMessage);

export default router;