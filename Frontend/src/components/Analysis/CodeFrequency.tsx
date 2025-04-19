import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import { fetchCodeFrequency } from '../../services/apiService';
import LoadingSpinner from '../UI/LoadingSpinner';

interface CodeFrequencyProps {
  repoUrl: string;
}

interface CodeFrequencyData {
  Date: string;
  'Code Additions': number;
  'Code Deletions': number;
}

const CodeFrequency: React.FC<CodeFrequencyProps> = ({ repoUrl }) => {
  const [data, setData] = useState<CodeFrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [repoUrl]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchCodeFrequency(repoUrl);
      setData(response);
    } catch (err) {
      console.error('Error loading code frequency:', err);
      setError('Failed to load code frequency data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Code Frequency</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Weekly additions and deletions to the repository
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
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No code frequency data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="Date" 
                tick={{ fill: '#64748b' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#1e293b',
                }}
                formatter={(value) => [value, value < 0 ? 'Deletions' : 'Additions']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#64748b" />
              <Bar 
                dataKey="Code Additions" 
                fill="#10b981" 
                stackId="stack"
                animationDuration={1000}
              />
              <Bar 
                dataKey="Code Deletions" 
                fill="#ef4444" 
                stackId="stack"
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Additions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Deletions</span>
        </div>
      </div>
    </div>
  );
};

export default CodeFrequency;