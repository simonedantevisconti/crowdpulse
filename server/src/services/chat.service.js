import { analyzeSentiment } from "./sentiment.service.js";

const recentMessages = [];
const MAX_RECENT_MESSAGES = 200;

export const processMessage = (message) => {
  const sentiment = analyzeSentiment(message.content?.text || "");

  return {
    ...message,
    sentiment,
  };
};

export const storeMessage = (message) => {
  recentMessages.push(message);

  if (recentMessages.length > MAX_RECENT_MESSAGES) {
    recentMessages.shift();
  }

  return message;
};

export const getRecentMessages = () => {
  return [...recentMessages];
};
