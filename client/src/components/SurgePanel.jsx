import { useChatStore } from "../store/chatStore";

const formatRate = (rate) => {
  return Number.isFinite(rate) ? rate.toFixed(2) : "0.00";
};

const SurgePanel = () => {
  const surgeInsights = useChatStore((state) => state.surgeInsights);

  const {
    isSurging,
    intensity,
    recentMessages,
    currentRate,
    baselineRate,
    windowMs,
  } = surgeInsights;

  const windowSeconds = Math.round(windowMs / 1000);

  return (
    <section className="surge-panel">
      <div className="surge-panel__header">
        <div>
          <span className="panel-eyebrow">Audience activity</span>
          <h2>Surge Detector</h2>
        </div>

        <span
          className={`surge-panel__status ${
            isSurging
              ? "surge-panel__status--active"
              : "surge-panel__status--stable"
          }`}
        >
          {isSurging ? "Surge detected" : "Stable"}
        </span>
      </div>

      <div className="surge-panel__metric">
        <span>Messages in last {windowSeconds}s</span>
        <strong>{recentMessages}</strong>
      </div>

      <div className="surge-panel__metric">
        <span>Current rate</span>
        <strong>{formatRate(currentRate)} msg/s</strong>
      </div>

      <div className="surge-panel__metric">
        <span>Baseline rate</span>
        <strong>{formatRate(baselineRate)} msg/s</strong>
      </div>

      <div className="surge-panel__metric">
        <span>Intensity</span>
        <strong>{Number(intensity || 0).toFixed(2)}×</strong>
      </div>
    </section>
  );
};

export default SurgePanel;
