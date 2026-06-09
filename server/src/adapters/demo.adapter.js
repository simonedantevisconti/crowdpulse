import { normalizeMessage } from "../utils/normalizeMessage.js";

const demoMessages = [
  {
    platform: "twitch",
    username: "purpleDragon",
    displayName: "PurpleDragon",
    text: "That play was absolutely insane 🔥",
  },
  {
    platform: "kick",
    username: "marco_live",
    displayName: "Marco Live",
    text: "Clip it! This moment is incredible",
  },
  {
    platform: "x",
    username: "sara_streams",
    displayName: "Sara Streams",
    text: "Best part of the stream so far #CrowdPulse",
  },
  {
    platform: "twitch",
    username: "pixelKnight",
    displayName: "PixelKnight",
    text: "Can you explain how you did that?",
  },
  {
    platform: "kick",
    username: "lucas_92",
    displayName: "Lucas",
    text: "Audio is a little low for me",
  },
  {
    platform: "x",
    username: "streamWatcher",
    displayName: "Stream Watcher",
    text: "The unified chat idea is actually amazing",
  },

  // Stesso utente rilevato su piattaforme differenti.
  {
    platform: "twitch",
    username: "marcoLive",
    displayName: "Marco Live",
    text: "I am also watching from Twitch",
  },
  {
    platform: "x",
    username: "marco.live",
    displayName: "Marco Live",
    text: "CrowdPulse recognized me across platforms",
  },
];

let messageIndex = 0;
let intervalId = null;

export const startDemoAdapter = (onMessage) => {
  if (intervalId) {
    return;
  }

  intervalId = setInterval(() => {
    const source = demoMessages[messageIndex % demoMessages.length];

    const message = normalizeMessage({
      ...source,
      externalId: crypto.randomUUID(),
      channelId: "crowdpulse-demo",
      createdAt: new Date().toISOString(),
    });

    onMessage(message);

    messageIndex += 1;
  }, 2200);
};

export const stopDemoAdapter = () => {
  if (!intervalId) {
    return;
  }

  clearInterval(intervalId);
  intervalId = null;
};
