import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import Chat from "./components/Chat";

interface Message {
  userMessage: string;
  botReply: string;
  timestamp: string;
}

export default function App() {
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chats");
        const data: Message[] = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" align="center" sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
        💬 SBK RAG Chat Bot
      </Typography>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
        ) : (
          <Chat history={history} />
        )}
      </Box>
    </Box>
  );
}
