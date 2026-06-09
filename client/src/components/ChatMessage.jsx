const PLATFORM_LABELS = {
  twitch: "Twitch",
  kick: "Kick",
  x: "X",
};

const formatTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateValue));
};

const ChatMessage = ({ message }) => {
  const platform = message?.platform || "unknown";
  const user = message?.user || {};
  const content = message?.content || {};
  const sentiment = message?.sentiment || {
    label: "neutral",
    score: 0,
  };

  return (
    <article className={`chat-message chat-message--${platform}`}>
      <div className="chat-message__platform-line" />

      <img
        className="chat-message__avatar"
        src={user.avatarUrl}
        alt={user.displayName || user.username || "User avatar"}
      />

      <div className="chat-message__content">
        <div className="chat-message__header">
          <span className={`platform-badge platform-badge--${platform}`}>
            {PLATFORM_LABELS[platform] || platform}
          </span>

          <strong className="chat-message__username">
            {user.displayName || user.username || "Unknown user"}
          </strong>

          {user.username && (
            <span className="chat-message__handle">@{user.username}</span>
          )}

          <time className="chat-message__time">
            {formatTime(message.createdAt)}
          </time>
        </div>

        <p className="chat-message__text">{content.text || "Empty message"}</p>

        <div className="chat-message__footer">
          <span className={`sentiment-tag sentiment-tag--${sentiment.label}`}>
            {sentiment.label}
          </span>

          <span className="sentiment-score">
            {sentiment.score > 0 ? "+" : ""}
            {Number(sentiment.score || 0).toFixed(2)}
          </span>
        </div>

        {content.attachments?.length > 0 && (
          <div className="chat-message__attachments">
            {content.attachments.map((attachment, index) => (
              <img
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                alt={attachment.alt || "Message attachment"}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ChatMessage;
