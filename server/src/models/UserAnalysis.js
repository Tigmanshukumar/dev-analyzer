// server/src/models/UserAnalysis.js

import mongoose from "mongoose";

const userAnalysisSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },

  data: { type: Object, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserAnalysis", userAnalysisSchema);