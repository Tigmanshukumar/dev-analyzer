// server/src/routes/analyzeRoute.js

import express from "express";
import { analyzeUser } from "../services/githubService.js";

const router = express.Router();

router.get("/analyze/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const data = await analyzeUser(username);

    res.status(200).json(data);
  } catch (error) {
    console.error("Analyze Error:", error.message);

    res.status(500).json({
      error: "Failed to analyze user",
    });
  }
});

export default router;