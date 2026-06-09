const DEFAULT_INSIGHTS = {
  total: 0,
  positive: 0,
  neutral: 0,
  negative: 0,
  averageScore: 0,
  mood: "neutral",
};

export const calculateSentimentInsights = (messages = []) => {
  if (messages.length === 0) {
    return DEFAULT_INSIGHTS;
  }

  const totals = messages.reduce(
    (result, message) => {
      const label = message.sentiment?.label || "neutral";
      const score = Number(message.sentiment?.score || 0);

      result[label] += 1;
      result.scoreSum += score;

      return result;
    },
    {
      positive: 0,
      neutral: 0,
      negative: 0,
      scoreSum: 0,
    },
  );

  const total = messages.length;
  const averageScore = totals.scoreSum / total;

  let mood = "neutral";

  if (averageScore >= 0.15) {
    mood = "positive";
  }

  if (averageScore <= -0.15) {
    mood = "negative";
  }

  return {
    total,
    positive: totals.positive,
    neutral: totals.neutral,
    negative: totals.negative,

    positivePercentage: Math.round((totals.positive / total) * 100),

    neutralPercentage: Math.round((totals.neutral / total) * 100),

    negativePercentage: Math.round((totals.negative / total) * 100),

    averageScore: Number(averageScore.toFixed(2)),
    mood,
  };
};
