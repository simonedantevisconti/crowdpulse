import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chatStore";
import ChatMessage from "./ChatMessage";

const ChatFeed = () => {
  const messages = useChatStore((state) => state.messages);
  const feedEndRef = useRef(null);

  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!isPaused) {
      feedEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isPaused]);

  return (
    <section className="chat-panel">
      <div className="chat-panel__header">
        <div>
          <span className="eyebrow">Unified feed</span>
          <h2>Live messages</h2>
        </div>

        <div className="chat-panel__actions">
          <span className="message-counter">{messages.length} messages</span>

          <button
            type="button"
            className={`pause-button ${isPaused ? "pause-button--paused" : ""}`}
            onClick={() => setIsPaused((current) => !current)}
          >
            {isPaused ? "Resume scroll" : "Pause scroll"}
          </button>
        </div>
      </div>

      <div className="chat-feed">
        {messages.length === 0 ? (
          <div className="empty-feed">
            <span className="empty-feed__pulse" />
            <p>Waiting for the first message…</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        <div ref={feedEndRef} />
      </div>
    </section>
  );
};

export default ChatFeed;
