import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { startDemoAdapter } from "./adapters/demo.adapter.js";

import {
  processMessage,
  storeMessage,
  getRecentMessages,
  getLatestSurgeInsights,
} from "./services/chat.service.js";

import { calculateSentimentInsights } from "./services/insights.service.js";
import { getIdentityMatches } from "./services/identity.service.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: CLIENT_URL,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "CrowdPulse API",
    status: "online",
  });
});

app.get("/api/messages", (req, res) => {
  res.json({
    success: true,
    messages: getRecentMessages(),
  });
});

io.on("connection", (socket) => {
  console.log(`Socket collegato: ${socket.id}`);

  socket.emit("connection:ready", {
    message: "Connessione CrowdPulse attiva",
    socketId: socket.id,
  });

  socket.emit("chat:history", getRecentMessages());

  socket.emit(
    "sentiment:update",
    calculateSentimentInsights(getRecentMessages()),
  );

  const surgeInsights = getLatestSurgeInsights();

  if (surgeInsights) {
    socket.emit("surge:update", surgeInsights);
  }

  socket.emit("identity:update", getIdentityMatches());

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnesso: ${socket.id} — ${reason}`);
  });
});

const publishMessage = (message) => {
  const processedMessage = processMessage(message);
  const storedMessage = storeMessage(processedMessage);

  io.emit("chat:message", storedMessage);

  const sentimentInsights = calculateSentimentInsights(getRecentMessages());

  io.emit("sentiment:update", sentimentInsights);

  const surgeInsights = getLatestSurgeInsights();

  if (surgeInsights) {
    io.emit("surge:update", surgeInsights);
  }

  io.emit("identity:update", getIdentityMatches());

  console.log(
    `[${storedMessage.platform.toUpperCase()}]`,
    `${storedMessage.user.username}:`,
    storedMessage.content.text,
    `→ ${storedMessage.sentiment.label}`,
    storedMessage.sentiment.score,
  );
};

startDemoAdapter(publishMessage);

httpServer.listen(PORT, () => {
  console.log(`CrowdPulse server attivo su http://localhost:${PORT}`);
});
