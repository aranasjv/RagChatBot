import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectMongo, saveChat, getChats, clearChats } from "./mongo.ts";
import { runRagPipeline } from "./ragPipeline.ts";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

connectMongo();
console.log("✅ Connected to MongoDB");

// Middleware to log incoming requests
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("💬 Received message:", message);

  try {
    // Run RAG pipeline
    const response = await runRagPipeline(message);
    console.log("🤖 RAG response:", response);

    // Save to Mongo
    await saveChat(message, response);
    console.log("💾 Chat saved to MongoDB");

    res.json({ reply: response });
  } catch (error) {
    console.error("❌ Error in /api/chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch history
app.get("/api/chats", async (_req, res) => {
  try {
    const chats = await getChats();
    console.log(`📜 Retrieved ${chats.length} chats from MongoDB`);
    res.json(chats);
  } catch (error) {
    console.error("❌ Error in /api/chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Clear chat history
app.delete("/api/chats/clear", async (_req, res) => {
  try {
    const deletedCount = await clearChats();
    console.log(`🧹 Cleared ${deletedCount} chats from MongoDB`);
    res.json({ message: `Cleared ${deletedCount} chats` });
  } catch (error) {
    console.error("❌ Error in /api/chats/clear:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
