import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Calendar, ChevronDown } from 'lucide-react';
import { fetchCommitFrequency } from '../../services/apiService';
import LoadingSpinner from '../LoadingSpinner';

interface CommitFrequencyProps {
  repoUrl: string;
}

type FrequencyOption = 'day' | 'week' | 'month';

const CommitFrequency: React.FC<CommitFrequencyProps> = ({ repoUrl }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<FrequencyOption>('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [repoUrl, frequency]);

  const loadData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetchCommitFrequency(repoUrl, frequency);

    // Sort and slice the entries for the selected frequency
    let entries = Object.entries(response.commit_frequency);
    entries.sort(([a], [b]) => a.localeCompare(b));
    if (frequency === 'day') {
      entries = entries.slice(-15);
    } else if (frequency === 'week') {
      entries = entries.slice(-4);
    } else if (frequency === 'month') {
      entries = entries.slice(-12);
    }

    // Transform for chart
    const chartData = entries.map(([date, count]) => ({
      date,
      commits: count,
    }));

    setData(chartData);
  } catch (err) {
    console.error('Error loading commit frequency:', err);
    setError('Failed to load commit frequency data');
  } finally {
    setLoading(false);
  }
};

  const frequencyOptions: { value: FrequencyOption; label: string }[] = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Helper to get the correct slice and header
  const getDisplayDataAndHeader = () => {
    let displayData = data;
    let header = 'Commit Frequency';
    if (frequency === 'day') {
      displayData = data.slice(-15);
      header = 'Commit Frequency (Last 15 Days)';
    } else if (frequency === 'week') {
      displayData = data.slice(-4);
      header = 'Commit Frequency (Last 4 Weeks)';
    } else if (frequency === 'month') {
      displayData = data.slice(-12);
      header = 'Commit Frequency (Last 12 Months)';
    }
    return { displayData, header };
  };

  const { displayData, header } = getDisplayDataAndHeader();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">{header}</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Number of commits over time
          </p>
        </div>
        
        <div className="relative mt-4 sm:mt-0">
          <button 
            className="btn btn-secondary flex items-center"
            onClick={toggleDropdown}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {frequencyOptions.find(opt => opt.value === frequency)?.label}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      frequency === option.value
                        ? 'bg-primary-50 text-primary-700 dark:bg-neutral-700 dark:text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => {
                      setFrequency(option.value);
                      setIsDropdownOpen(false);
                    }}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
        ) : displayData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No commit data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={displayData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b' }}
                tickFormatter={(value) => {
                  if (frequency === 'day') {
                    const date = new Date(value);
                    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  } else if (frequency === 'week') {
                    // Week format: "YYYY-Www" or "YYYY-MM-DD_to_YYYY-MM-DD"
                    if (value.includes('_to_')) {
                      const [start, end] = value.split('_to_');
                      return `${new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}–${new Date(end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                    }
                    const [year, week] = value.split('-W');
                    if (year && week) return `W${week} ${year}`;
                    return value;
                  } else if (frequency === 'month') {
                    // Month format: "YYYY-MM"
                    const [year, month] = value.split('-');
                    if (year && month) {
                      return new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                    }
                    return value;
                  }
                  return value;
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
                formatter={(value) => [`${value} commits`, 'Commits']}
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
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#0ea5e9"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CommitFrequency;
