import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark, materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  user: string;
  bot: string;
}

export default function Message({ user, bot }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
      {/* User Message */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Paper
          sx={{ p: 1.5, maxWidth: "75%", bgcolor: "#0b93f6", color: "#fff", borderRadius: "16px 16px 0 16px" }}
          elevation={2}
        >
          <Typography variant="body1"><b>You:</b> {user}</Typography>
        </Paper>
      </Box>

      {/* Bot Message */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Paper
          sx={{ p: 1.5, maxWidth: "75%", bgcolor: "#e5e5ea", color: "#000", borderRadius: "16px 16px 16px 0" }}
          elevation={1}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={materialLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code style={{ backgroundColor: "#ddd", padding: "2px 4px", borderRadius: "4px" }} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {bot}
          </ReactMarkdown>
        </Paper>
      </Box>
    </Box>
  );
}
