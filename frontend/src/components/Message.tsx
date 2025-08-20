import { Box, Paper, Typography, Avatar } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight as prismStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

interface Props {
  user: string;
  bot: string;
}

export default function Message({ user, bot }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      
      {/* User Message */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: 1 }}>
        <Paper
          sx={{
            p: 1.5,
            maxWidth: "70%",
            bgcolor: "#0b93f6",
            color: "#fff",
            borderRadius: "18px 18px 4px 18px",
            boxShadow: 2,
          }}
          elevation={0}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.8, mb: 0.5 }}>
            You
          </Typography>
          <Typography variant="body1">{user}</Typography>
        </Paper>
        <Avatar sx={{ bgcolor: "#0b93f6" }}>U</Avatar>
      </Box>

      {/* Bot Message */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: 1 }}>
        <Avatar sx={{ bgcolor: "#555" }}>🤖</Avatar>
        <Paper
          sx={{
            p: 1.5,
            maxWidth: "70%",
            bgcolor: "#f5f5f5",
            color: "#000",
            borderRadius: "18px 18px 18px 4px",
            boxShadow: 1,
          }}
          elevation={0}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.7, mb: 0.5 }}>
            Bot
          </Typography>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={prismStyle}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "0.85rem",
                      backgroundColor: "#272822",
                      color: "#f8f8f2",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    style={{
                      backgroundColor: "#eee",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {bot}
          </ReactMarkdown>
        </Paper>
      </Box>
    </Box>
  );
}
