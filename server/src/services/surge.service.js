const DEFAULT_WINDOW_MS = 10_000;
const DEFAULT_BASELINE_WINDOW_MS = 60_000;
const DEFAULT_MULTIPLIER = 2;
const DEFAULT_MIN_MESSAGES = 5;

const messageTimestamps = [];

const removeExpiredTimestamps = (
  currentTime,
  baselineWindowMs = DEFAULT_BASELINE_WINDOW_MS,
) => {
  const oldestAllowedTimestamp = currentTime - baselineWindowMs;

  while (
    messageTimestamps.length > 0 &&
    messageTimestamps[0] < oldestAllowedTimestamp
  ) {
    messageTimestamps.shift();
  }
};

export const detectSurge = (
  message,
  {
    windowMs = DEFAULT_WINDOW_MS,
    baselineWindowMs = DEFAULT_BASELINE_WINDOW_MS,
    multiplier = DEFAULT_MULTIPLIER,
    minMessages = DEFAULT_MIN_MESSAGES,
  } = {},
) => {
  const currentTime = new Date(message.createdAt).getTime();

  if (Number.isNaN(currentTime)) {
    throw new Error("Il messaggio deve contenere un createdAt valido.");
  }

  messageTimestamps.push(currentTime);
  removeExpiredTimestamps(currentTime, baselineWindowMs);

  const recentWindowStart = currentTime - windowMs;

  const recentMessages = messageTimestamps.filter(
    (timestamp) => timestamp >= recentWindowStart,
  ).length;

  const baselineMessages = messageTimestamps.filter(
    (timestamp) => timestamp < recentWindowStart,
  ).length;

  const baselineDurationMs = Math.max(baselineWindowMs - windowMs, windowMs);

  const baselineRate =
    baselineMessages > 0 ? baselineMessages / (baselineDurationMs / 1000) : 0;

  const currentRate = recentMessages / (windowMs / 1000);

  const surgeThreshold =
    baselineRate > 0
      ? baselineRate * multiplier
      : minMessages / (windowMs / 1000);

  const isSurging =
    recentMessages >= minMessages && currentRate >= surgeThreshold;

  const intensity =
    surgeThreshold > 0 ? Number((currentRate / surgeThreshold).toFixed(2)) : 0;

  return {
    isSurging,
    intensity,
    recentMessages,
    currentRate: Number(currentRate.toFixed(2)),
    baselineRate: Number(baselineRate.toFixed(2)),
    windowMs,
    detectedAt: new Date(currentTime).toISOString(),
  };
};

export const resetSurgeDetector = () => {
  messageTimestamps.length = 0;
};
