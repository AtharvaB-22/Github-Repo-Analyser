import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { validateGitHubUrl } from '../utils/validators';

const InputPage = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsValidating(true);
      const { isValid, owner, repo, error } = validateGitHubUrl(repoUrl);

      if (!isValid) {
        setError(error || 'Please enter a valid GitHub repository URL');
        return;
      }

      // Simulating API validation - in a real app this would check if the repo exists
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigate to analysis page
      navigate(`/analysis/${owner}/${repo}`);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 animate-fade-in">
      <div className="w-full max-w-md px-4 py-8 sm:px-8 sm:py-10">
        <div className="text-center mb-8">
          <Github className="h-16 w-16 mx-auto mb-4 text-neutral-900 dark:text-white" />
          <h1 className="text-3xl font-semibold mb-2">GitHub Repo Analyzer</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Enter a GitHub repository URL to analyze its stats and visualize the data
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="repo-url" 
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Repository URL
            </label>
            <input
              id="repo-url"
              type="text"
              placeholder="https://github.com/owner/repo"
              className="input-field"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isValidating}
              aria-describedby={error ? "url-error" : undefined}
            />
            {error && (
              <p id="url-error" className="mt-2 text-sm text-error-600 dark:text-error-500">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isValidating || repoUrl.trim() === ''}
          >
            {isValidating ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <ArrowRight className="h-5 w-5 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Analyze Repository'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Try these examples:
          </p>
          <div className="mt-2 space-y-2">
            {[
              'https://github.com/facebook/react',
              'https://github.com/vercel/next.js',
              'https://github.com/tailwindlabs/tailwindcss'
            ].map((example) => (
              <button
                key={example}
                className="text-primary-600 dark:text-primary-400 text-sm hover:underline block mx-auto"
                onClick={() => setRepoUrl(example)}
                type="button"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;