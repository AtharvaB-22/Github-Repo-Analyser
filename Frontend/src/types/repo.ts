export interface RepoData {
  name: string;
  stars: number;
  forks: number;
  watchers: number;
}

export interface CommitData {
  date: string;
  commits: number;
}

export interface ContributorData {
  login: string;
  commits: number;
  avatar_url?: string;
}

export interface LanguageData {
  bytes: Record<string, number>;
  percentages: Record<string, number>;
}

export interface CodeFrequencyData {
  Date: string;
  'Code Additions': number;
  'Code Deletions': number;
}

export interface PullRequestData {
  open: number;
  closed_unmerged: number;
  merged: number;
}

export interface HeatmapData {
  date: string;
  commits: number;
}