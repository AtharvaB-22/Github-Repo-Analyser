import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchPullRequests } from '../../services/apiService';
import LoadingSpinner from '../UI/LoadingSpinner';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PullRequestsProps {
  repoUrl: string;
}

interface PullRequestData {
  open: number;
  closed_unmerged: number;
  merged: number;
}

const PullRequests: React.FC<PullRequestsProps> = ({ repoUrl }) => {
  const [prData, setPrData] = useState<PullRequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [repoUrl]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchPullRequests(repoUrl);
      setPrData(data);
    } catch (err) {
      console.error('Error loading pull requests:', err);
      setError('Failed to load pull request data');
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const chartData = prData ? {
    labels: ['Open', 'Closed (Unmerged)', 'Merged'],
    datasets: [
      {
        data: [prData.open, prData.closed_unmerged, prData.merged],
        backgroundColor: [
          '#f97316', // orange
          '#ef4444', // red
          '#10b981', // green
        ],
        borderWidth: 0,
      },
    ],
  } : null;

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: '#64748b',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const total = prData ? prData.open + prData.closed_unmerged + prData.merged : 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Pull Requests</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Pull request statistics
        </p>
      </div>
      
      <div className={`chart-container min-h-[300px] ${loading ? 'loading' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-error-600 dark:text-error-500">
            {error}
          </div>
        ) : !prData || (prData.open === 0 && prData.closed_unmerged === 0 && prData.merged === 0) ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No pull request data available
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 relative">
              {chartData && <Doughnut data={chartData} options={chartOptions} />}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-semibold">{total}</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Total PRs</span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-lg">
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-warning-500 text-2xl font-semibold mb-1">{prData?.open}</div>
                <div className="text-neutral-600 dark:text-neutral-400 text-sm">Open</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-error-500 text-2xl font-semibold mb-1">{prData?.closed_unmerged}</div>
                <div className="text-neutral-600 dark:text-neutral-400 text-sm">Closed</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div className="text-success-500 text-2xl font-semibold mb-1">{prData?.merged}</div>
                <div className="text-neutral-600 dark:text-neutral-400 text-sm">Merged</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequests;