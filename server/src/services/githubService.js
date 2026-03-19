const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubApi = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  }
});

const getUserData = async (username) => {
  const response = await githubApi.get(`/users/${username}`);
  return response.data;
};

const getUserRepos = async (username) => {
  const response = await githubApi.get(`/users/${username}/repos?per_page=100&sort=updated`);
  return response.data;
};

module.exports = {
  getUserData,
  getUserRepos
};
