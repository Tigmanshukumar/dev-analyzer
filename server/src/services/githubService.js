// server/src/services/githubService.js

import axios from "axios";
import UserAnalysis from "../models/UserAnalysis.js";

export const analyzeUser = async (username) => {
  try {
    // -----------------------------
    // 🔥 CHECK CACHE FIRST
    // -----------------------------
    const existing = await UserAnalysis.findOne({ username });

    if (existing) {
      const isFresh =
        Date.now() - new Date(existing.updatedAt).getTime() <
        24 * 60 * 60 * 1000;

      if (isFresh) {
        return existing.data; // ✅ RETURN CACHED DATA
      }
    }

    // -----------------------------
    // 🔥 FETCH FROM GITHUB
    // -----------------------------
    const [userRes, repoRes, eventsRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos`),
      axios.get(`https://api.github.com/users/${username}/events`),
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
    // 🔥 SCORING
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
    // 🔥 ACTIVITY
    // -----------------------------
    const activity = {
      recentPushEvents: events.filter(e => e.type === "PushEvent").length,
      recentActivityScore: Math.min(
        events.filter(e => e.type === "PushEvent").length * 5,
        100
      ),
    };

    // -----------------------------
    // 🔥 CONSISTENCY
    // -----------------------------
    const calculateConsistency = async () => {
      const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

      let commitDates = [];

      for (const repo of topRepos) {
        try {
          const commitsRes = await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=30`
          );

          commitsRes.data.forEach((commit) => {
            commitDates.push(commit.commit.author.date);
          });
        } catch {
          continue;
        }
      }

      if (!commitDates.length) {
        return { consistencyScore: 0 };
      }

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
    // 🔥 INSIGHT
    // -----------------------------
    const insight = {
      roleFit: personality,
      summary: `${username} is a ${personality.toLowerCase()} with ${
        activity.recentActivityScore > 60 ? "high" : "moderate"
      } recent activity and ${
        consistency.consistencyScore > 60 ? "good" : "limited"
      } consistency.`,
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
      personality,
      insight,
    };

    // -----------------------------
    // 🔥 SAVE TO MONGODB
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
    throw new Error("GitHub API failed");
  }
};