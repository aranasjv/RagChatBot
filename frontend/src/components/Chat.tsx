import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

interface ChatMessage {
  userMessage: string;
  botReply: string;
  timestamp: string;
}

interface Props {
  history: ChatMessage[];
}

export default function Chat({ history }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(history);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { userMessage: input, botReply: "", timestamp: new Date().toISOString() };
    setMessages([...messages, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();

      setMessages(prev =>
        prev.map(msg =>
          msg.timestamp === newUserMessage.timestamp ? { ...msg, botReply: data.reply } : msg
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await fetch("http://localhost:5000/api/chats/clear", { method: "DELETE" });
      setMessages([]); // Clear frontend too
    } catch (err) {
      console.error("❌ Error clearing chat:", err);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Messages container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((m, i) => (
          <Message key={i} user={m.userMessage} bot={m.botReply} />
        ))}
        {loading && <CircularProgress sx={{ alignSelf: "center", mt: 2 }} />}
        <div ref={messagesEndRef} /> {/* Dummy div to scroll into view */}
      </Box>

      {/* Input + Clear button */}
      <Box sx={{ display: "flex", gap: 1, p: 2, borderTop: "1px solid #ddd" }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton color="primary" onClick={sendMessage} disabled={loading || !input.trim()}>
          <SendIcon />
        </IconButton>
        <IconButton color="secondary" onClick={clearChat}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
