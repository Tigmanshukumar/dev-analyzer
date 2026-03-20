import { analyzeUser } from "./githubService.js";

export const compareUsers = async (usernames) => {
  const results = [];

  for (const username of usernames) {
    const data = await analyzeUser(username);
    results.push({
      username,
      ...data,
    });
  }

  // -----------------------------
  // 🔥 RANKING LOGIC
  // -----------------------------
  const ranked = results.sort((a, b) => {
    // 1. Hireability score
    if (b.hireability.score !== a.hireability.score) {
      return b.hireability.score - a.hireability.score;
    }

    // 2. Quality
    if (b.quality.averageScore !== a.quality.averageScore) {
      return b.quality.averageScore - a.quality.averageScore;
    }

    // 3. Consistency
    return (
      b.consistency.consistencyScore -
      a.consistency.consistencyScore
    );
  });

  // -----------------------------
  // 🔥 WINNER
  // -----------------------------
  const winner = ranked[0];

  return {
    winner: {
      username: winner.username,
      score: winner.hireability.score,
      label: winner.hireability.label,
    },
    ranking: ranked.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      score: user.hireability.score,
      label: user.hireability.label,
    })),
  };
};