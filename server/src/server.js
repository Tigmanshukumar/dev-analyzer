import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import { connectDB } from "./config/db.js";
import compareRoute from "./routes/compareRoute.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoutes);
app.use("/api", compareRoute);

connectDB();



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});