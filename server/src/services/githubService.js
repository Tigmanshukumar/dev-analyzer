// server/src/services/githubService.js

import UserAnalysis from "../models/UserAnalysis.js";
import githubClient from "../utils/githubClient.js";
import { generateSummary } from "./aiService.js";

export const analyzeUser = async (username, forceRefresh = false) => {
  let existing;

  try {
    // -----------------------------
    // 🔥 CACHE CHECK
    // -----------------------------
    existing = await UserAnalysis.findOne({ username });

    if (existing && !forceRefresh) {
      const isFresh =
        Date.now() - new Date(existing.updatedAt).getTime() <
        24 * 60 * 60 * 1000;

      if (isFresh) return existing.data;
    }

    // -----------------------------
    // 🔥 SAFE REQUEST
    // -----------------------------
    const safeRequest = async (fn) => {
      try {
        return await fn();
      } catch (error) {
        if (error.response?.status === 403) {
          throw new Error("RATE_LIMIT");
        }
        throw error;
      }
    };

    // -----------------------------
    // 🔥 FETCH DATA
    // -----------------------------
    const [userRes, repoRes, eventsRes] = await Promise.all([
      safeRequest(() => githubClient.get(`/users/${username}`)),
      safeRequest(() => githubClient.get(`/users/${username}/repos`)),
      safeRequest(() => githubClient.get(`/users/${username}/events`)),
    ]);

    const user = userRes.data;
    const repos = repoRes.data;
    const events = eventsRes.data;

    // -----------------------------
    // 🔥 METRICS
    // -----------------------------
    let totalStars = 0;
    let languages = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;

      if (repo.language) {
        languages[repo.language] =
          (languages[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languages).sort(
      (a, b) => b[1] - a[1]
    );

    const topLanguages = sortedLanguages.map(([lang]) => lang);

    const metrics = {
      totalRepos: repos.length,
      totalStars,
      languageDiversity: Object.keys(languages).length,
      topLanguages: topLanguages.slice(0, 3),
    };

    // -----------------------------
    // 🔥 ROLE SCORING
    // -----------------------------
    const calculateScores = () => {
      let backendScore = 0;
      let frontendScore = 0;

      const backendLangs = ["Node", "Java", "Python", "C", "C++", "Go"];
      const frontendLangs = ["JavaScript", "TypeScript", "HTML", "CSS"];

      topLanguages.slice(0, 3).forEach((lang) => {
        if (backendLangs.includes(lang)) backendScore += 25;
        if (frontendLangs.includes(lang)) frontendScore += 25;
      });

      backendScore += Math.min(metrics.totalRepos * 2, 20);
      frontendScore += Math.min(metrics.totalRepos * 2, 20);

      const popularityScore = Math.min(metrics.totalStars / 1000, 100);

      return { backendScore, frontendScore, popularityScore };
    };

    const scores = calculateScores();

    // -----------------------------
    // 🔥 REPO QUALITY
    // -----------------------------
    const calculateRepoQuality = (repo) => {
      let score = 0;

      score += Math.min(repo.stargazers_count / 50, 30);
      score += Math.min(repo.forks_count / 20, 20);

      const issuePenalty = Math.min(repo.open_issues_count * 2, 15);
      score -= issuePenalty;

      score += Math.min(repo.size / 1000, 15);

      const daysAgo =
        (Date.now() - new Date(repo.updated_at)) /
        (1000 * 60 * 60 * 24);

      if (daysAgo < 30) score += 20;
      else if (daysAgo < 90) score += 10;
      else score += 2;

      return Math.max(0, Math.min(score, 100));
    };

    const repoScores = repos.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      qualityScore: calculateRepoQuality(repo),
    }));

    const topQualityRepos = [...repoScores]
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 3);

    const weightedScore =
      repoScores.reduce((sum, r) => {
        return sum + r.qualityScore * (r.stars + 1);
      }, 0) /
      (repoScores.reduce((sum, r) => sum + (r.stars + 1), 0) || 1);

    const hasHighQualityRepo = repoScores.some(
      (r) => r.qualityScore > 75
    );

    // -----------------------------
    // 🔥 ACTIVITY
    // -----------------------------
    const pushEvents = events.filter(
      (e) => e.type === "PushEvent"
    ).length;

    const activity = {
      recentPushEvents: pushEvents,
      recentActivityScore: Math.min(pushEvents * 5, 100),
    };

    // -----------------------------
    // 🔥 CONSISTENCY
    // -----------------------------
    const calculateConsistency = async () => {
      const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

      let commitDates = [];

      for (const repo of topRepos) {
        try {
          const commitsRes = await safeRequest(() =>
            githubClient.get(
              `/repos/${username}/${repo.name}/commits?per_page=30`
            )
          );

          commitsRes.data.forEach((commit) => {
            commitDates.push(commit.commit.author.date);
          });
        } catch {
          continue;
        }
      }

      if (!commitDates.length) return { consistencyScore: 0 };

      const periods = {};

      commitDates.forEach((date) => {
        const key = new Date(date).toISOString().slice(0, 7);
        periods[key] = true;
      });

      const activePeriods = Object.keys(periods).length;

      return {
        activePeriods,
        consistencyScore: Math.min(activePeriods * 20, 100),
      };
    };

    const consistency = await calculateConsistency();

    // -----------------------------
    // 🔥 PERSONALITY
    // -----------------------------
    const personality =
      scores.backendScore > scores.frontendScore + 10
        ? "Backend Developer"
        : scores.frontendScore > scores.backendScore + 10
        ? "Frontend Developer"
        : "Full Stack Developer";

    // -----------------------------
    // 🔥 HIREABILITY (FIXED)
    // -----------------------------
    const calculateHireability = () => {
      let score = 0;

      score += weightedScore * 0.4;
      score += consistency.consistencyScore * 0.2;
      score += activity.recentActivityScore * 0.15;

      // ⚠️ reduced weight (avoid bias)
      score += scores.popularityScore * 0.1;

      if (hasHighQualityRepo) score += 10;

      return Math.min(Math.round(score), 100);
    };

    const getHireLabel = (score) => {
      if (score >= 80) return "Strong Hire";
      if (score >= 65) return "Hire";
      if (score >= 50) return "Consider";
      return "Low Priority";
    };

    const hireabilityScore = calculateHireability();
    const hireLabel = getHireLabel(hireabilityScore);

    // -----------------------------
    // 🔥 INSIGHT
    // -----------------------------
    const insight = {
      roleFit: personality,
      summary: `${username} is a ${personality.toLowerCase()} with ${
        activity.recentActivityScore > 60 ? "high" : "moderate"
      } activity, ${
        consistency.consistencyScore > 60 ? "good" : "limited"
      } consistency, and ${
        hasHighQualityRepo
          ? "strong project quality"
          : "moderate project quality"
      }. Overall evaluation: ${hireLabel}.`,
    };

    // -----------------------------
    // 🔥 FINAL RESULT
    // -----------------------------
    const result = {
      profile: {
        username: user.login,
        avatar: user.avatar_url,
        followers: user.followers,
      },
      metrics,
      scores,
      activity,
      consistency,
      quality: {
        averageScore: Math.round(weightedScore),
        hasHighQualityRepo,
        topRepos: topQualityRepos,
      },
      hireability: {
        score: hireabilityScore,
        label: hireLabel,
      },
      personality,
      insight,
    };

    const aiSummary = await generateSummary(result);
    result.ai = { summary: aiSummary };

    // -----------------------------
    // 🔥 SAVE CACHE
    // -----------------------------
    await UserAnalysis.findOneAndUpdate(
      { username },
      {
        data: result,
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    return result;

  } catch (error) {
    console.error("GitHub Service Error:", error.message);

    if (existing) return existing.data;

    throw new Error("GitHub API failed");
  }
};