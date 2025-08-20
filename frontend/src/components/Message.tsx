import { Box, Paper, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as prismStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ContentCopy, Check } from "@mui/icons-material";
import React, { useState } from "react";

interface Props {
  user: string;
  bot: string;
}

export default function Message({ user, bot }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
                const codeString = String(children).replace(/\n$/, "");

                return !inline && match ? (
                  <Box sx={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                    {/* Copy button */}
                    <Tooltip title={copiedCode === codeString ? "Copied!" : "Copy"}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(codeString)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(255,255,255,0.15)",
                          color: "#fff",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                          zIndex: 10,
                        }}
                      >
                        {copiedCode === codeString ? (
                          <Check fontSize="small" />
                        ) : (
                          <ContentCopy fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <SyntaxHighlighter
                      style={prismStyle}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: "14px",
                        fontSize: "0.85rem",
                        backgroundColor: "#1e1e1e",
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </Box>
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
