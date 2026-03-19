export interface Repository {
  name: string;
  language: string;
  stars: number;
  forks: number;
  description: string;
}

export interface UserAnalysis {
  username: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  repos: Repository[];
}
