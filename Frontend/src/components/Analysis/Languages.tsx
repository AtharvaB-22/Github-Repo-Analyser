import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchLanguages } from '../../services/apiService';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Code } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguagesProps {
  repoUrl: string;
}

interface LanguageData {
  bytes: Record<string, number>;
  percentages: Record<string, number>;
}

// Color palette for languages
const COLORS = [
  '#0ea5e9', // blue
  '#f97316', // orange
  '#10b981', // green
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#6b7280', // gray
];

const Languages: React.FC<LanguagesProps> = ({ repoUrl }) => {
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [repoUrl]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchLanguages(repoUrl);
      setLanguageData(data);
    } catch (err) {
      console.error('Error loading languages:', err);
      setError('Failed to load language data');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Prepare chart data
  const chartData = languageData ? {
    labels: Object.keys(languageData.percentages),
    datasets: [
      {
        data: Object.values(languageData.percentages),
        backgroundColor: COLORS.slice(0, Object.keys(languageData.percentages).length),
        borderWidth: 0,
      },
    ],
  } : null;

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          color: '#64748b',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = value.toFixed(1);
            
            if (languageData && languageData.bytes) {
              const bytes = languageData.bytes[label];
              return `${label}: ${percentage}% (${formatBytes(bytes)})`;
            }
            
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Languages</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Programming languages used in this repository
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
        ) : !languageData || Object.keys(languageData.percentages).length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No language data available
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
              {chartData && <Pie data={chartData} options={chartOptions} />}
            </div>
            
            <div className="w-full md:w-1/2 mt-6 md:mt-0">
              <h3 className="text-lg font-medium mb-3">Language breakdown</h3>
              <div className="space-y-3">
                {Object.entries(languageData.percentages)
                  .sort(([, a], [, b]) => b - a)
                  .map(([language, percentage], index) => (
                    <div key={language} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{language}</span>
                          <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Languages;