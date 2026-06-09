import { useChatStore } from "../store/chatStore";

const SentimentPanel = () => {
  const insights = useChatStore((state) => state.sentimentInsights);

  return (
    <section className="sentiment-panel">
      <div className="sentiment-panel__header">
        <div>
          <span className="eyebrow">Live sentiment</span>
          <h3 className={`mood mood--${insights.mood}`}>{insights.mood}</h3>
        </div>

        <span className="sentiment-average">
          {insights.averageScore > 0 ? "+" : ""}
          {insights.averageScore.toFixed(2)}
        </span>
      </div>

      <div className="sentiment-distribution">
        <div className="sentiment-row">
          <div className="sentiment-row__label">
            <span>Positive</span>
            <strong>{insights.positivePercentage}%</strong>
          </div>

          <div className="sentiment-bar">
            <div
              className="sentiment-bar__value sentiment-bar__value--positive"
              style={{
                width: `${insights.positivePercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="sentiment-row">
          <div className="sentiment-row__label">
            <span>Neutral</span>
            <strong>{insights.neutralPercentage}%</strong>
          </div>

          <div className="sentiment-bar">
            <div
              className="sentiment-bar__value sentiment-bar__value--neutral"
              style={{
                width: `${insights.neutralPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="sentiment-row">
          <div className="sentiment-row__label">
            <span>Negative</span>
            <strong>{insights.negativePercentage}%</strong>
          </div>

          <div className="sentiment-bar">
            <div
              className="sentiment-bar__value sentiment-bar__value--negative"
              style={{
                width: `${insights.negativePercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      <p className="sentiment-panel__total">
        Based on {insights.total} live messages
      </p>
    </section>
  );
};

export default SentimentPanel;
