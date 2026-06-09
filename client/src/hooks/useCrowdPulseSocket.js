import { useEffect } from "react";
import { io } from "socket.io-client";
import { useChatStore } from "../store/chatStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const useCrowdPulseSocket = () => {
  const setConnection = useChatStore((state) => state.setConnection);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);

  const setSentimentInsights = useChatStore(
    (state) => state.setSentimentInsights,
  );

  const setSurgeInsights = useChatStore((state) => state.setSurgeInsights);

  const setIdentityMatches = useChatStore((state) => state.setIdentityMatches);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnection({
        isConnected: true,
        socketId: socket.id,
      });
    });

    socket.on("connection:ready", (payload) => {
      setConnection({
        isConnected: true,
        socketId: payload.socketId,
      });
    });

    socket.on("chat:history", (messages) => {
      setMessages(messages);
    });

    socket.on("chat:message", (message) => {
      addMessage(message);
    });

    socket.on("sentiment:update", (insights) => {
      setSentimentInsights(insights);
    });

    socket.on("surge:update", (insights) => {
      setSurgeInsights(insights);
    });

    socket.on("identity:update", (matches) => {
      setIdentityMatches(matches);
    });

    socket.on("disconnect", () => {
      setConnection({
        isConnected: false,
        socketId: null,
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Errore Socket.IO:", error.message);

      setConnection({
        isConnected: false,
        socketId: null,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [
    addMessage,
    setConnection,
    setMessages,
    setSentimentInsights,
    setSurgeInsights,
    setIdentityMatches,
  ]);
};
