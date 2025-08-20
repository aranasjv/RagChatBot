import { Router } from "express";
import { handleChat, fetchChats, clearChatHistory } from "../controllers/chatController";

const router = Router();

router.post("/chat", handleChat);
router.get("/chats", fetchChats);
router.delete("/chats/clear", clearChatHistory);

export default router;
