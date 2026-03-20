// server/src/routes/analyzeRoute.js

import express from "express";
import { analyzeUser } from "../services/githubService.js";


const router = express.Router();

router.get("/analyze/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { refresh } = req.query; // 🔥 NEW

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Convert "true"/"false" → boolean
    const forceRefresh = refresh === "true";

    const data = await analyzeUser(username, forceRefresh);

    res.status(200).json({
      success: true,
      cached: !forceRefresh, // 🔥 optional but useful
      data,
    });

  } catch (error) {
    console.error("Analyze Error:", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to analyze user",
    });
  }
});

export default router;