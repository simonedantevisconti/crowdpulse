export const normalizeMessage = ({
  id,
  platform,
  externalId,
  channelId,
  username,
  displayName,
  avatarUrl,
  text,
  fragments = [],
  attachments = [],
  createdAt = new Date().toISOString(),
}) => {
  return {
    id: id || `${platform}-${externalId || crypto.randomUUID()}`,
    platform,
    externalId: externalId || null,
    channelId: channelId || null,

    user: {
      id: null,
      username,
      displayName: displayName || username,
      avatarUrl:
        avatarUrl ||
        `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
          username,
        )}`,
    },

    content: {
      text,
      fragments,
      attachments,
    },

    sentiment: {
      score: 0,
      label: "neutral",
    },

    identity: {
      id: null,
      confidence: null,
      suggestedMatch: null,
    },

    createdAt,
  };
};
