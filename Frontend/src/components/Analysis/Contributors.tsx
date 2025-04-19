import { useState, useEffect } from 'react';
import { fetchContributors } from '../../services/apiService';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Users } from 'lucide-react';

interface ContributorsProps {
  repoUrl: string;
}

interface Contributor {
  login: string;
  commits: number;
  avatar_url?: string;
}

const Contributors: React.FC<ContributorsProps> = ({ repoUrl }) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [repoUrl]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchContributors(repoUrl);
      
      // Add avatar URLs to contributors
      const enhancedContributors = data.map((contributor: Contributor) => ({
        ...contributor,
        avatar_url: `https://github.com/${contributor.login}.png`,
      }));
      
      setContributors(enhancedContributors);
    } catch (err) {
      console.error('Error loading contributors:', err);
      setError('Failed to load contributors data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Contributors</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          People who have contributed to this repository
        </p>
      </div>
      
      <div className={`chart-container ${loading ? 'loading' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-error-600 dark:text-error-500">
            {error}
          </div>
        ) : contributors.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No contributor data available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contributors.slice(0, 9).map((contributor) => (
              <div 
                key={contributor.login}
                className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 flex items-center"
              >
                <div className="flex-shrink-0 mr-4">
                  {contributor.avatar_url ? (
                    <img 
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="h-12 w-12 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/40x40/374151/FFFFFF?text=User';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                      <Users className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                    </div>
                  )}
                </div>
                <div>
                  <a 
                    href={`https://github.com/${contributor.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {contributor.login}
                  </a>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {contributor.commits} commit{contributor.commits !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {contributors.length > 9 && (
        <div className="mt-4 text-center">
          <a 
            href={`${repoUrl}/graphs/contributors`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all {contributors.length} contributors
          </a>
        </div>
      )}
    </div>
  );
};

export default Contributors;