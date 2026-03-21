import express from "express";
import { compareUsers } from "../services/compareService.js";

const router = express.Router();

router.get("/compare", async (req, res) => {
  try {
    const { users, role } = req.query;

    if (!users) {
      return res.status(400).json({
        error: "Provide users",
      });
    }

    const usernames = users.split(",");

    const result = await compareUsers(
      usernames,
      role || "general"
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Comparison failed" });
  }
});

export default router;