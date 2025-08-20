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

// Response from backend (what the assistant replies)
export interface ApiResponse {
  response: string;
  sources?: string[];
}

// For MongoDB storage (conversation collection)
export interface Conversation {
  _id?: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
