import { RepoData } from '../types/repo';

// Base URL for the Flask backend API
const API_ENDPOINT = 'http://localhost:5000/api'; // Update this if your backend URL changes (e.g., for production)

// Fetch basic repository information from /api/repo
export async function fetchRepoData(repoUrl: string): Promise<RepoData> {
  const response = await fetch(`${API_ENDPOINT}/repo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repo data: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    name: data.name,
    stars: data.stars,
    forks: data.forks,
    watchers: data.watchers,
  };
}

// Fetch commit frequency data from /api/commits
export async function fetchCommitFrequency(repoUrl: string, frequency: string = 'week') {
  const response = await fetch(`${API_ENDPOINT}/commits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl, frequency }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch commit frequency: ${response.statusText}`);
  }
  
  const data = await response.json();
  return { commit_frequency: data.commit_frequency };
}

// Fetch contributors data from /api/contributors
export async function fetchContributors(repoUrl: string) {
  const response = await fetch(`${API_ENDPOINT}/contributors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch contributors: ${response.statusText}`);
  }
  
  return response.json(); // Returns array of { login, commits }
}

// Fetch languages data from /api/languages
export async function fetchLanguages(repoUrl: string) {
  const response = await fetch(`${API_ENDPOINT}/languages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }
  
  return response.json(); // Returns { bytes, percentages }
}

// Fetch code frequency data from /api/code_frequency
export async function fetchCodeFrequency(repoUrl: string) {
  const response = await fetch(`${API_ENDPOINT}/code_frequency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch code frequency: ${response.statusText}`);
  }
  
  return response.json(); // Returns array of { Date, Code Additions, Code Deletions }
}

// Fetch pull request statistics from /api/pull_requests
export async function fetchPullRequests(repoUrl: string) {
  const response = await fetch(`${API_ENDPOINT}/pull_requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pull requests: ${response.statusText}`);
  }
  
  return response.json(); // Returns { open, closed_unmerged, merged }
}

// Fetch contribution heatmap data from /api/contribution_heatmap
export async function fetchContributionHeatmap(repoUrl: string) {
  const response = await fetch(`${API_ENDPOINT}/contribution_heatmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch contribution heatmap: ${response.statusText}`);
  }
  
  return response.json(); // Returns array of { date, commits }
}