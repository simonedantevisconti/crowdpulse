import { create } from "zustand";

const MAX_MESSAGES = 200;

const initialSentimentInsights = {
  total: 0,
  positive: 0,
  neutral: 0,
  negative: 0,
  positivePercentage: 0,
  neutralPercentage: 0,
  negativePercentage: 0,
  averageScore: 0,
  mood: "neutral",
};

const initialSurgeInsights = {
  isSurging: false,
  intensity: 0,
  recentMessages: 0,
  currentRate: 0,
  baselineRate: 0,
  windowMs: 10000,
  detectedAt: null,
};

export const useChatStore = create((set) => ({
  messages: [],
  isConnected: false,
  socketId: null,
  sentimentInsights: initialSentimentInsights,
  surgeInsights: initialSurgeInsights,
  identityMatches: [],

  setConnection: ({ isConnected, socketId = null }) => {
    set({
      isConnected,
      socketId,
    });
  },

  setMessages: (messages) => {
    set({
      messages: messages.slice(-MAX_MESSAGES),
    });
  },

  addMessage: (message) => {
    set((state) => {
      const alreadyExists = state.messages.some(
        (existingMessage) => existingMessage.id === message.id,
      );

      if (alreadyExists) {
        return state;
      }

      return {
        messages: [...state.messages, message].slice(-MAX_MESSAGES),
      };
    });
  },

  setSentimentInsights: (sentimentInsights) => {
    set({
      sentimentInsights,
    });
  },

  setSurgeInsights: (surgeInsights) => {
    set({
      surgeInsights,
    });
  },

  setIdentityMatches: (identityMatches) => {
    set({
      identityMatches: Array.isArray(identityMatches) ? identityMatches : [],
    });
  },

  clearMessages: () => {
    set({
      messages: [],
      sentimentInsights: initialSentimentInsights,
      surgeInsights: initialSurgeInsights,
      identityMatches: [],
    });
  },
}));
