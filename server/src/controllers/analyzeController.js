const githubService = require('../services/githubService');

const analyzeProfile = async (req, res) => {
  const { username } = req.params;
  
  try {
    const userData = await githubService.getUserData(username);
    const repoData = await githubService.getUserRepos(username);
    
    // Basic analysis (could be expanded later)
    const analysis = {
      username: userData.login,
      name: userData.name,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      avatar_url: userData.avatar_url,
      repos: repoData.map(repo => ({
        name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        description: repo.description
      }))
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing profile:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch GitHub data', 
      message: error.message 
    });
  }
};

module.exports = {
  analyzeProfile
};
