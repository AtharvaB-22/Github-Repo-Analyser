import { Eye, GitFork, Star } from 'lucide-react';
import { RepoData } from '../../types/repo';

interface RepoHeaderProps {
  repoData: RepoData;
  owner: string;
  repo: string;
}

const RepoHeader: React.FC<RepoHeaderProps> = ({ repoData, owner, repo }) => {
  const { stars, forks, watchers } = repoData;

  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-2xl font-semibold mb-1">
            <p>Username: {owner}</p>
            <p>Repo Name: {repo}</p>
          </div>
          <a 
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            View on GitHub
          </a>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Detailed repository analysis and visualization
          </p>
        </div>
        
        <div className="flex items-center space-x-5 mt-4 md:mt-0">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-warning-500 mr-2" />
            <span className="font-medium">{formatNumber(stars)}</span>
            <span className="sr-only">stars</span>
          </div>
          
          <div className="flex items-center">
            <GitFork className="h-5 w-5 text-primary-500 mr-2" />
            <span className="font-medium">{formatNumber(forks)}</span>
            <span className="sr-only">forks</span>
          </div>
          
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-success-500 mr-2" />
            <span className="font-medium">{formatNumber(watchers)}</span>
            <span className="sr-only">watchers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Format number with commas for thousands (e.g., 1,234)
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default RepoHeader;