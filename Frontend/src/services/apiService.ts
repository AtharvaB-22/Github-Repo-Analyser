import { RepoData } from '../types/repo';

const API_ENDPOINT = '/api'; // Replace with actual API endpoint in production

// Simulate API calls - in a real app these would call the actual endpoints
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 800));

// Fetch basic repository information
export async function fetchRepoData(repoUrl: string): Promise<RepoData> {
  await mockDelay();
  // Sample data for demo
  return {
    name: repoUrl.split('/').pop() || '',
    stars: Math.floor(Math.random() * 10000),
    forks: Math.floor(Math.random() * 2000),
    watchers: Math.floor(Math.random() * 500),
  };
}

// Fetch commit frequency data
export async function fetchCommitFrequency(repoUrl: string, frequency: string = 'week') {
  await mockDelay();
  
  // Generate sample data based on frequency
  const data: Record<string, number> = {};
  const today = new Date();
  let numPoints = 0;
  
  switch(frequency) {
    case 'day':
      numPoints = 14; // Two weeks of daily data
      break;
    case 'week':
      numPoints = 12; // 12 weeks
      break;
    case 'month':
      numPoints = 6; // 6 months
      break;
    default:
      numPoints = 12;
  }
  
  for (let i = numPoints - 1; i >= 0; i--) {
    const date = new Date(today);
    
    switch(frequency) {
      case 'day':
        date.setDate(date.getDate() - i);
        break;
      case 'week':
        date.setDate(date.getDate() - (i * 7));
        break;
      case 'month':
        date.setMonth(date.getMonth() - i);
        break;
    }
    
    const dateStr = date.toISOString().split('T')[0];
    data[dateStr] = Math.floor(Math.random() * 20) + 1; // 1-20 commits
  }
  
  return { commit_frequency: data };
}

// Fetch contributors data
export async function fetchContributors(repoUrl: string) {
  await mockDelay();
  
  // Sample contributors data
  const numContributors = Math.floor(Math.random() * 8) + 5; // 5-12 contributors
  const contributors = [];
  
  for (let i = 0; i < numContributors; i++) {
    contributors.push({
      login: `user${i + 1}`,
      commits: Math.floor(Math.random() * 200) + 1, // 1-200 commits
    });
  }
  
  return contributors.sort((a, b) => b.commits - a.commits);
}

// Fetch languages data
export async function fetchLanguages(repoUrl: string) {
  await mockDelay();
  
  // Sample languages
  const possibleLanguages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C++',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'HTML',
    'CSS',
  ];
  
  // Randomly select 2-5 languages
  const numLanguages = Math.floor(Math.random() * 4) + 2;
  const selectedLanguages = possibleLanguages
    .sort(() => 0.5 - Math.random())
    .slice(0, numLanguages);
  
  // Generate random byte counts
  const bytes: Record<string, number> = {};
  let totalBytes = 0;
  
  selectedLanguages.forEach(lang => {
    const langBytes = Math.floor(Math.random() * 500000) + 50000;
    bytes[lang] = langBytes;
    totalBytes += langBytes;
  });
  
  // Calculate percentages
  const percentages: Record<string, number> = {};
  
  Object.entries(bytes).forEach(([lang, langBytes]) => {
    percentages[lang] = +(langBytes / totalBytes * 100).toFixed(2);
  });
  
  return { bytes, percentages };
}

// Fetch code frequency data
export async function fetchCodeFrequency(repoUrl: string) {
  await mockDelay();
  
  // Sample code frequency data
  const numWeeks = 8;
  const data = [];
  const today = new Date();
  
  for (let i = numWeeks - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    
    const dateStr = date.toISOString().split('T')[0];
    const additions = Math.floor(Math.random() * 3000) + 500;
    const deletions = -(Math.floor(Math.random() * 1500) + 100);
    
    data.push({
      'Date': dateStr,
      'Code Additions': additions,
      'Code Deletions': deletions,
    });
  }
  
  return data;
}

// Fetch pull request statistics
export async function fetchPullRequests(repoUrl: string) {
  await mockDelay();
  
  // Sample pull request data
  return {
    open: Math.floor(Math.random() * 15) + 1,
    closed_unmerged: Math.floor(Math.random() * 20) + 5,
    merged: Math.floor(Math.random() * 60) + 30,
  };
}

// Fetch contribution heatmap data
export async function fetchContributionHeatmap(repoUrl: string) {
  await mockDelay();
  
  // Sample heatmap data
  const data = [];
  const today = new Date();
  const numDays = 60; // Past 60 days
  
  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Randomly decide if there were commits on this day
    if (Math.random() > 0.5) {
      const commits = Math.floor(Math.random() * 8) + 1; // 1-8 commits
      data.push({ date: dateStr, commits });
    } else {
      data.push({ date: dateStr, commits: 0 });
    }
  }
  
  return data;
}