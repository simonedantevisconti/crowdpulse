const identityProfiles = [];

const normalizeIdentityValue = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]/g, "");
};

const calculateSimilarity = (firstValue, secondValue) => {
  const first = normalizeIdentityValue(firstValue);
  const second = normalizeIdentityValue(secondValue);

  if (!first || !second) {
    return 0;
  }

  if (first === second) {
    return 1;
  }

  if (first.includes(second) || second.includes(first)) {
    return 0.8;
  }

  const firstCharacters = new Set(first);
  const secondCharacters = new Set(second);

  const sharedCharacters = [...firstCharacters].filter((character) =>
    secondCharacters.has(character),
  ).length;

  const totalCharacters = new Set([...firstCharacters, ...secondCharacters])
    .size;

  if (totalCharacters === 0) {
    return 0;
  }

  return Number((sharedCharacters / totalCharacters).toFixed(2));
};

export const compareUserIdentities = (firstUser, secondUser) => {
  if (!firstUser || !secondUser) {
    return {
      confidence: 0,
      suggestedMatch: false,
    };
  }

  const usernameSimilarity = calculateSimilarity(
    firstUser.username,
    secondUser.username,
  );

  const displayNameSimilarity = calculateSimilarity(
    firstUser.displayName,
    secondUser.displayName,
  );

  const confidence = Number(
    (usernameSimilarity * 0.7 + displayNameSimilarity * 0.3).toFixed(2),
  );

  return {
    confidence,
    suggestedMatch: confidence >= 0.8,
  };
};

const createIdentityId = (platform, userId) => {
  return `identity-${platform}-${userId}`;
};

export const resolveIdentity = (message) => {
  const { platform, user } = message;

  const existingPlatformProfile = identityProfiles.find(
    (profile) => profile.platform === platform && profile.user.id === user.id,
  );

  if (existingPlatformProfile) {
    return {
      id: existingPlatformProfile.identityId,
      confidence: 1,
      suggestedMatch: false,
    };
  }

  let bestMatch = null;

  identityProfiles.forEach((profile) => {
    if (profile.platform === platform) {
      return;
    }

    const comparison = compareUserIdentities(user, profile.user);

    if (!bestMatch || comparison.confidence > bestMatch.confidence) {
      bestMatch = {
        identityId: profile.identityId,
        platform: profile.platform,
        user: profile.user,
        ...comparison,
      };
    }
  });

  const hasSuggestedMatch = Boolean(bestMatch?.suggestedMatch);

  const identityId = hasSuggestedMatch
    ? bestMatch.identityId
    : createIdentityId(platform, user.id);

  identityProfiles.push({
    identityId,
    platform,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    },
  });

  return {
    id: identityId,
    confidence: hasSuggestedMatch ? bestMatch.confidence : 1,
    suggestedMatch: hasSuggestedMatch,
    matchedPlatform: hasSuggestedMatch ? bestMatch.platform : null,
    matchedUser: hasSuggestedMatch ? bestMatch.user : null,
  };
};

export const getIdentityProfiles = () => {
  return [...identityProfiles];
};

export const resetIdentityProfiles = () => {
  identityProfiles.length = 0;
};
