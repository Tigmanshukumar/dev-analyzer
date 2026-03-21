import { analyzeUser } from "./githubService.js";
import { generateSummary } from "./aiService.js";

export const compareUsers = async (usernames, role = "general") => {
  const results = [];

  for (const username of usernames) {
    const data = await analyzeUser(username);
    results.push({
      username,
      ...data,
    });
  }

  const ranked = results.sort((a, b) => {
    // ... (rest of sorting logic)
    if (role === "backend") {
      return b.scores.backendScore - a.scores.backendScore;
    }

    if (role === "frontend") {
      return b.scores.frontendScore - a.scores.frontendScore;
    }

    if (role === "fullstack") {
      const aScore = a.scores.backendScore + a.scores.frontendScore;
      const bScore = b.scores.backendScore + b.scores.frontendScore;
      return bScore - aScore;
    }

    if (b.hireability.score !== a.hireability.score) {
      return b.hireability.score - a.hireability.score;
    }

    if (b.quality.averageScore !== a.quality.averageScore) {
      return b.quality.averageScore - a.quality.averageScore;
    }

    return b.consistency.consistencyScore - a.consistency.consistencyScore;
  });

  const comparisonText = await generateSummary(ranked);

  const winner = ranked[0];

  return {
    roleUsed: role,
    winner: {
      username: winner.username,
      score: winner.hireability.score,
      label: winner.hireability.label,
    },
    ranking: ranked.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      score: user.hireability.score,
      roleScore:
        role === "backend"
          ? user.scores.backendScore
          : role === "frontend"
          ? user.scores.frontendScore
          : null,
    })),
    comparison: comparisonText,
  };
};