import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingScreen from '../components/UI/LoadingScreen';
import TabNavigation from '../components/Analysis/TabNavigation';
import RepoHeader from '../components/Analysis/RepoHeader';
import { fetchRepoData } from '../services/apiService';
import { RepoData } from '../types/repo';
import ErrorMessage from '../components/UI/ErrorMessage';
import CommitFrequency from '../components/Analysis/CommitFrequency';
import Contributors from '../components/Analysis/Contributors';
import Languages from '../components/Analysis/Languages';
import CodeFrequency from '../components/Analysis/CodeFrequency';
import PullRequests from '../components/Analysis/PullRequests';
import ContributionHeatmap from '../components/Analysis/ContributionHeatmap';

type TabType = 'commits' | 'contributors' | 'languages' | 'code' | 'pulls' | 'heatmap';

const AnalysisPage = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('commits');
  const [refreshing, setRefreshing] = useState(false);

  const repoUrl = `https://github.com/${owner}/${repo}`;

  useEffect(() => {
    if (!owner || !repo) {
      navigate('/');
      return;
    }

    loadRepoData();
  }, [owner, repo]);

  const loadRepoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchRepoData(repoUrl);
      setRepoData(data);
    } catch (err) {
      console.error('Error loading repo data:', err);
      setError('Failed to load repository data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadRepoData();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadRepoData} />;
  }

  return (
    <div className="animate-fade-in">
      {repoData && (
        <>
          <div className="mb-8 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to home
              </button>
              
              <button 
                onClick={handleRefresh}
                className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh data'}
              </button>
            </div>
            
            <RepoHeader repoData={repoData} owner={owner!} repo={repo!} />
          </div>
          
          <div className="card overflow-hidden">
            <TabNavigation 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            
            <div className="p-6">
              {activeTab === 'commits' && (
                <CommitFrequency repoUrl={repoUrl} />
              )}
              
              {activeTab === 'contributors' && (
                <Contributors repoUrl={repoUrl} />
              )}
              
              {activeTab === 'languages' && (
                <Languages repoUrl={repoUrl} />
              )}
              
              {activeTab === 'code' && (
                <CodeFrequency repoUrl={repoUrl} />
              )}
              
              {activeTab === 'pulls' && (
                <PullRequests repoUrl={repoUrl} />
              )}
              
              {activeTab === 'heatmap' && (
                <ContributionHeatmap repoUrl={repoUrl} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisPage;