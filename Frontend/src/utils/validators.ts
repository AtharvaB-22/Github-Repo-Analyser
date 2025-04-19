export function validateGitHubUrl(url: string): { 
  isValid: boolean; 
  owner?: string; 
  repo?: string;
  error?: string;
} {
  // Basic validation
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a GitHub repository URL' };
  }

  try {
    // Try to parse the URL
    const parsedUrl = new URL(url);
    
    // Check if it's github.com
    if (parsedUrl.hostname !== 'github.com') {
      return { isValid: false, error: 'URL must be from github.com' };
    }
    
    // Extract path components
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    
    // Need at least owner and repo
    if (pathParts.length < 2) {
      return { isValid: false, error: 'URL must include both owner and repository' };
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    return { isValid: true, owner, repo };
  } catch (err) {
    // If URL parsing fails, check for simpler format
    const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubPattern);
    
    if (match && match[1] && match[2]) {
      return { isValid: true, owner: match[1], repo: match[2] };
    }
    
    return { isValid: false, error: 'Invalid GitHub repository URL' };
  }
}