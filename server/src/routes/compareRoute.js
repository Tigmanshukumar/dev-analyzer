import express from "express";
import { compareUsers } from "../services/compareService.js";

const router = express.Router();

router.get("/compare", async (req, res) => {
  try {
    const { users } = req.query;

    if (!users) {
      return res.status(400).json({
        error: "Provide users query param",
      });
    }

    const usernames = users.split(",");

    if (usernames.length < 2) {
      return res.status(400).json({
        error: "Minimum 2 users required",
      });
    }

    const result = await compareUsers(usernames);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Compare Error:", error.message);

    res.status(500).json({
      error: "Comparison failed",
    });
  }
});

export default router;