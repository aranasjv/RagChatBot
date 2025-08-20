import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
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
  await chats.insertOne({
    userMessage,
    botReply,
    timestamp: new Date()
  });
}

export async function getChats() {
  const chats = db.collection("chats");
  return chats.find().sort({ timestamp: 1 }).toArray();
}
