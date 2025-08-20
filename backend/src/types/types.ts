// backend/src/types.ts

// A single chat message
export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

// Request payload when frontend sends a new message
export interface SendMessageRequest {
  message: string;
  history: ChatMessage[];
}

// Response from backend (assistant reply)
export interface ApiResponse {
  response: string;
  sources?: string[]; // List of documents used
}

// For MongoDB storage (conversation collection)
export interface Conversation {
  _id?: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------
// RAG-specific types
// ----------------------------

// A raw document from your knowledge base
export interface Document {
  id: string;
  title?: string;
  content: string;
  metadata?: Record<string, any>; // e.g. source, author, tags
}

// A chunked piece of a document (used for embeddings)
export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata?: Record<string, any>;
}

// Vector embedding of a document chunk
export interface Embedding {
  vector: number[];
  chunkId: string;
  documentId: string;
}

// Retrieval result (from vector search)
export interface RetrievedChunk {
  chunk: DocumentChunk;
  score: number; // similarity score
}

// RAG pipeline request
export interface RagRequest {
  query: string;
  history: ChatMessage[];
}

// RAG pipeline response
export interface RagResponse {
  answer: string;
  sources: RetrievedChunk[];
}
