import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});