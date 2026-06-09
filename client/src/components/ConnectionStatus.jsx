import { useChatStore } from "../store/chatStore";

const ConnectionStatus = () => {
  const isConnected = useChatStore((state) => state.isConnected);

  return (
    <div
      className={`connection-status ${
        isConnected ? "is-connected" : "is-disconnected"
      }`}
    >
      <span className="connection-status__dot" />

      <span>
        {isConnected ? "Live connection active" : "Connecting to server"}
      </span>
    </div>
  );
};

export default ConnectionStatus;
