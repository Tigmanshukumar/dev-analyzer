// server/src/services/githubService.js

import axios from "axios";

export const analyzeUser = async (username) => {
  try {
    // -----------------------------
    // 🔥 FETCH BASE DATA
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
    // 🔥 RECENT ACTIVITY
    // -----------------------------
    const calculateActivity = () => {
      let pushEvents = 0;

      events.forEach((event) => {
        if (event.type === "PushEvent") pushEvents++;
      });

      return {
        recentPushEvents: pushEvents,
        recentActivityScore: Math.min(pushEvents * 5, 100),
      };
    };

    const activity = calculateActivity();

    // -----------------------------
    // 🔥 COMMIT CONSISTENCY (NEW)
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
        } catch (err) {
          continue;
        }
      }

      if (commitDates.length === 0) {
        return {
          consistencyScore: 0,
          message: "No recent commit data available",
        };
      }

      // Group commits by week
      const weeks = {};

      commitDates.forEach((date) => {
        const week = new Date(date).toISOString().slice(0, 7); // YYYY-MM
        weeks[week] = (weeks[week] || 0) + 1;
      });

      const activeWeeks = Object.keys(weeks).length;

      const consistencyScore = Math.min(activeWeeks * 20, 100);

      return {
        activePeriods: activeWeeks,
        consistencyScore,
      };
    };

    const consistency = await calculateConsistency();

    // -----------------------------
    // 🔥 PERSONALITY
    // -----------------------------
    const getPersonality = () => {
      if (scores.backendScore > scores.frontendScore + 10)
        return "Backend Developer";
      if (scores.frontendScore > scores.backendScore + 10)
        return "Frontend Developer";
      return "Full Stack Developer";
    };

    const personality = getPersonality();

    // -----------------------------
    // 🔥 INSIGHT
    // -----------------------------
    const generateInsight = () => {
      return {
        roleFit: personality,

        summary: `${username} is a ${personality.toLowerCase()} with ${
          activity.recentActivityScore > 60 ? "high" : "moderate"
        } recent activity and ${
          consistency.consistencyScore > 60 ? "good" : "limited"
        } consistency.`,

        strengths: [
          scores.popularityScore > 50
            ? "High project impact"
            : "Consistent project building",

          consistency.consistencyScore > 60
            ? "Strong long-term consistency"
            : "Some consistent contribution patterns",
        ],

        weaknesses: [
          consistency.consistencyScore < 30
            ? "Low long-term consistency"
            : "Consistency could improve",

          metrics.languageDiversity <= 2
            ? "Limited technology exposure"
            : "Moderate specialization",
        ],
      };
    };

    const insight = generateInsight();

    // -----------------------------
    // 🔥 FINAL RESPONSE
    // -----------------------------
    return {
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
  } catch (error) {
    console.error("GitHub Service Error:", error.message);
    throw new Error("GitHub API failed");
  }
};