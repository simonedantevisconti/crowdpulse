import { analyzeSentiment } from "./sentiment.service.js";
import { detectSurge } from "./surge.service.js";
import { resolveIdentity } from "./identity.service.js";

const recentMessages = [];
const MAX_RECENT_MESSAGES = 200;

let latestSurgeInsights = null;

export const processMessage = (message) => {
  const sentiment = analyzeSentiment(message.content?.text || "");

  const messageWithSentiment = {
    ...message,
    sentiment,
  };

  const identity = resolveIdentity(messageWithSentiment);

  const processedMessage = {
    ...messageWithSentiment,
    identity,
  };

  latestSurgeInsights = detectSurge(processedMessage);

  return processedMessage;
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

export const getLatestSurgeInsights = () => latestSurgeInsights;
