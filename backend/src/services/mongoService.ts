import { MongoClient, Db } from "mongodb";
import logger from "../utils/logger";

const client = new MongoClient(uri);
const dbName = "rag_chat";
let db: Db | null = null;

/**
 * Connect to MongoDB Atlas
 */
export async function connectMongo() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
    logger.info("Connected to MongoDB: %s", dbName);
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err);
    logger.error("MongoDB connection failed: %s", err.message, { stack: err.stack });
    // Optional: do not exit; allow API to start even if Mongo fails
    db = null;
  }
}

/**
 * Get the MongoDB database instance safely
 */
function getDb(): Db {
  if (!db) {
    const errMsg = "MongoDB not connected";
    logger.error(errMsg);
    throw new Error(errMsg);
  }
  return db;
}

/**
 * Save a chat message
 */
export async function saveChat(userMessage: string, botReply: string) {
  try {
    const chats = getDb().collection("chats");
    await chats.insertOne({ userMessage, botReply, timestamp: new Date() });
    logger.info("💾 Chat saved: %s", userMessage);
  } catch (err: any) {
    console.error("❌ saveChat error:", err);
    logger.error("saveChat error: %s", err.message, { stack: err.stack });
  }
}

/**
 * Fetch all chat messages
 */
export async function getChats() {
  try {
    return await getDb().collection("chats").find().sort({ timestamp: 1 }).toArray();
  } catch (err: any) {
    console.error("❌ getChats error:", err);
    logger.error("getChats error: %s", err.message, { stack: err.stack });
    return []; // Return empty array instead of crashing
  }
}

/**
 * Clear all chat history
 */
export async function clearChats() {
  try {
    const result = await getDb().collection("chats").deleteMany({});
    logger.info("🧹 Cleared %d chats", result.deletedCount);
    return result.deletedCount;
  } catch (err: any) {
    console.error("❌ clearChats error:", err);
    logger.error("clearChats error: %s", err.message, { stack: err.stack });
    return 0; // Return 0 instead of crashing
  }
}
