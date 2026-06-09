const positiveWords = new Set([
  "amazing",
  "awesome",
  "beautiful",
  "best",
  "brilliant",
  "cool",
  "excellent",
  "fantastic",
  "fire",
  "fun",
  "good",
  "great",
  "happy",
  "incredible",
  "insane",
  "love",
  "nice",
  "perfect",
  "wonderful",
  "wow",

  "bello",
  "bellissimo",
  "bravo",
  "fantastico",
  "figo",
  "forte",
  "grande",
  "incredibile",
  "ottimo",
  "perfetto",
  "spettacolare",
]);

const negativeWords = new Set([
  "awful",
  "bad",
  "boring",
  "broken",
  "hate",
  "horrible",
  "lag",
  "lagging",
  "low",
  "problem",
  "sad",
  "slow",
  "terrible",
  "toxic",
  "ugly",
  "worse",
  "worst",

  "brutto",
  "lento",
  "male",
  "noioso",
  "odio",
  "orribile",
  "pessimo",
  "problema",
  "rotto",
  "schifo",
]);

const positiveEmojis = [
  "🔥",
  "❤️",
  "😍",
  "👏",
  "😂",
  "🤣",
  "🎉",
  "💯",
  "🚀",
  "🥳",
  "✨",
  "🙌",
];

const negativeEmojis = ["😡", "🤬", "😢", "😭", "💀", "👎", "🤮", "😴", "🙄"];

const intensifiers = new Set([
  "absolutely",
  "extremely",
  "really",
  "so",
  "super",
  "very",
  "davvero",
  "molto",
  "troppo",
]);

const negations = new Set([
  "not",
  "never",
  "no",
  "isn't",
  "wasn't",
  "don't",
  "doesn't",
  "non",
  "mai",
]);

const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const analyzeSentiment = (text = "") => {
  if (!text.trim()) {
    return {
      label: "neutral",
      score: 0,
      confidence: 0,
    };
  }

  const normalized = normalizeText(text);
  const words = normalized.split(" ").filter(Boolean);

  let rawScore = 0;
  let matchedSignals = 0;

  words.forEach((word, index) => {
    let wordScore = 0;

    if (positiveWords.has(word)) {
      wordScore = 1;
    }

    if (negativeWords.has(word)) {
      wordScore = -1;
    }

    if (wordScore === 0) {
      return;
    }

    const previousWord = words[index - 1];
    const previousTwoWords = words[index - 2];

    if (negations.has(previousWord) || negations.has(previousTwoWords)) {
      wordScore *= -1;
    }

    if (intensifiers.has(previousWord) || intensifiers.has(previousTwoWords)) {
      wordScore *= 1.5;
    }

    rawScore += wordScore;
    matchedSignals += 1;
  });

  positiveEmojis.forEach((emoji) => {
    const matches = text.split(emoji).length - 1;

    if (matches > 0) {
      rawScore += matches * 0.8;
      matchedSignals += matches;
    }
  });

  negativeEmojis.forEach((emoji) => {
    const matches = text.split(emoji).length - 1;

    if (matches > 0) {
      rawScore -= matches * 0.8;
      matchedSignals += matches;
    }
  });

  const exclamationCount = (text.match(/!/g) || []).length;

  if (exclamationCount > 1 && rawScore !== 0) {
    rawScore *= 1 + Math.min(exclamationCount, 4) * 0.08;
  }

  const letterCharacters = text.replace(/[^a-zA-Z]/g, "");
  const uppercaseCharacters = letterCharacters.replace(/[^A-Z]/g, "");

  const uppercaseRatio =
    letterCharacters.length > 5
      ? uppercaseCharacters.length / letterCharacters.length
      : 0;

  if (uppercaseRatio > 0.65 && rawScore !== 0) {
    rawScore *= 1.15;
  }

  const normalizedScore = clamp(rawScore / 3, -1, 1);

  let label = "neutral";

  if (normalizedScore >= 0.18) {
    label = "positive";
  }

  if (normalizedScore <= -0.18) {
    label = "negative";
  }

  const confidence =
    matchedSignals === 0 ? 0.25 : clamp(0.45 + matchedSignals * 0.12, 0, 0.98);

  return {
    label,
    score: Number(normalizedScore.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
  };
};
