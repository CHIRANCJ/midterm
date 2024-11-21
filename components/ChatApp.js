import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import websocketService from "./websocketService";
import { fetchMessageHistory } from "./messageService";

const ChatWidget = ({ connectionId, receiverId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { messages: history, lastEvaluatedKey: newKey } =
          await fetchMessageHistory(connectionId, receiverId, lastEvaluatedKey);

        const parsedHistory = history.map((msg) => ({
          ...msg,
          isSent: msg.senderId === connectionId,
        }));

        setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
        setLastEvaluatedKey(newKey);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    loadChatHistory();

    websocketService.connect(connectionId, (newMessage) => {
      const formattedMessage = {
        ...newMessage,
        isSent: newMessage.senderId === connectionId,
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      scrollToBottom();
    });

    return () => websocketService.close();
  }, [connectionId, receiverId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const messageData = {
        action: "sendMessage",
        senderId: connectionId,
        receiverId,
        content: inputMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };

      websocketService.sendMessage(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, isSent: true },
      ]);
      setInputMessage("");
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        right: 10,
        bottom: 10,
        width: { xs: "95%", md: "360px" },
        height: { xs: "85vh", md: "80vh" },
        display: "flex",
        flexDirection: "column",
        zIndex: 1300,
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          backgroundColor: "#075E54",
          color: "#fff",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: "#fff",
            padding: "5px", // Reduced padding for compact button
            marginRight: 1,
            borderRadius: "50%", // Circular shape
            width: "30px", // Smaller size
            height: "30px", // Smaller size
            "& svg": { fontSize: "1rem" }, // Smaller icon
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar
          sx={{
            bgcolor: "#128C7E",
            width: 28,
            height: 28,
            fontSize: "0.8rem",
            marginRight: 1.5,
          }}
        >
          P
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
          }}
        >
          Police Chat
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#ECE5DD",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.isSent ? "flex-end" : "flex-start",
                marginBottom: "5px",
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  padding: 1,
                  borderRadius: "10px",
                  backgroundColor: msg.isSent ? "#DCF8C6" : "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    fontSize: "0.7rem",
                    color: "#555",
                    marginTop: "2px",
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={chatContainerRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          backgroundColor: "#fff",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            marginRight: 1,
            backgroundColor: "#F6F6F6",
            borderRadius: "20px",
            maxWidth: "90%",
            "& .MuiOutlinedInput-root": {
              fontSize: "0.9rem",
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          sx={{
            bgcolor: inputMessage.trim() ? "#25D366" : "#bcbcbc",
            color: "#fff",
            borderRadius: "50%", // Circular shape
            width: "30px", // Smaller size
            height: "30px", // Smaller size
            padding: "5px", // Reduced padding
            "&:hover": {
              bgcolor: inputMessage.trim() ? "#128C7E" : "#bcbcbc",
            },
          }}
        >
          <SendIcon sx={{ fontSize: "1rem" }} /> {/* Smaller send icon */}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWidget;
