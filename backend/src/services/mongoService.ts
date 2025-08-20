import { MongoClient } from "mongodb";

const client = new MongoClient(uri);
const dbName = "rag_chat";
let db: any;

export async function connectMongo() {
  await client.connect();
  db = client.db(dbName);
  console.log("✅ Connected to MongoDB");
}

export async function saveChat(userMessage: string, botReply: string) {
  const chats = db.collection("chats");
  await chats.insertOne({ userMessage, botReply, timestamp: new Date() });
}

export async function clearChats() {
  const result = await db.collection("chats").deleteMany({});
  return result.deletedCount;
}

export async function getChats() {
  return db.collection("chats").find().sort({ timestamp: 1 }).toArray();
}
