import { Request, Response } from "express";
import { runRagPipeline } from "../services/ragPipeline";
import { saveChat, getChats, clearChats } from "../services/mongoService";
import logger from "../utils/logger";

// Chat handler
export async function handleChat(req: Request, res: Response) {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    console.warn("⚠️ Invalid chat request: missing or invalid message");
    logger.warn("Invalid chat request: missing or invalid message");
    return res.status(400).json({ error: "Message is required and must be a string" });
  }

  console.log(`💬 Received chat message: "${message}"`);
  logger.info(`Received chat message: "${message}"`);

  // Throw errors if something goes wrong; the global error handler will catch
  const response = await runRagPipeline(message);
  await saveChat(message, response);

  console.log(`✅ Chat processed successfully. Response:${response}` );
  logger.info("Chat processed successfully");

  res.json({ reply: response });
}

// Fetch chat history
export async function fetchChats(_req: Request, res: Response) {
  console.log("📜 Fetching chat history...");
  logger.info("Fetching chat history...");

  const chats = await getChats();

  console.log(`✅ Fetched ${chats.length} chats`);
  logger.info(`Fetched ${chats.length} chats`);

  res.json(chats);
}

// Clear chat history
export async function clearChatHistory(_req: Request, res: Response) {
  console.log("🧹 Clearing chat history...");
  logger.info("Clearing chat history...");

  const deletedCount = await clearChats();

  console.log(`✅ Cleared ${deletedCount} chats`);
  logger.info(`Cleared ${deletedCount} chats`);

  res.json({ message: `Cleared ${deletedCount} chats` });
}
