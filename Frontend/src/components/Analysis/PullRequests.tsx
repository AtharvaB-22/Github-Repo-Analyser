import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchPullRequests } from '../../services/apiService';
import LoadingSpinner from '../LoadingSpinner';

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
    setLoading(true);
    setError(null);
    fetchPullRequests(repoUrl)
      .then((data) => setPrData(data))
      .catch(() => setError('Failed to load pull request data'))
      .finally(() => setLoading(false));
  }, [repoUrl]);

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
          Open, merged, and closed (unmerged) pull requests
        </p>
      </div>
      <div className="chart-container min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <LoadingSpinner />
            <span className="mt-2 text-neutral-500">Loading data, please wait...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-error-600 dark:text-error-500">
            {error}
          </div>
        ) : !prData || total === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No pull request data available
          </div>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <Doughnut data={chartData!} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequests;