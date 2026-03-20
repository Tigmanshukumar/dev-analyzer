import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.warn("⚠️ Warning: GITHUB_TOKEN is not defined in the environment variables.");
}

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : "",
    Accept: "application/vnd.github.v3+json",
  },
});



export default githubClient;