import { useState, useEffect } from 'react';
import { fetchContributionHeatmap } from '../../services/apiService';
import LoadingSpinner from '../UI/LoadingSpinner';

interface ContributionHeatmapProps {
  repoUrl: string;
}

interface HeatmapData {
  date: string;
  commits: number;
}

// Function to get cell color based on commit count
const getCellColor = (commits: number, theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';

  if (commits === 0) {
    return isDark ? '#1e293b' : '#f1f5f9';
  } else if (commits <= 1) {
    return isDark ? '#0c4a6e' : '#bae6fd';
  } else if (commits <= 3) {
    return isDark ? '#075985' : '#7dd3fc';
  } else if (commits <= 5) {
    return isDark ? '#0369a1' : '#38bdf8';
  } else {
    return isDark ? '#0284c7' : '#0ea5e9';
  }
};

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ repoUrl }) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<HeatmapData | null>(null);
  
  // Get current theme from HTML element
  const isDarkMode = document.documentElement.classList.contains('dark');
  const theme = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    loadData();
  }, [repoUrl]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchContributionHeatmap(repoUrl);
      
      // Sort by date
      const sortedData = [...data].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setHeatmapData(sortedData);
    } catch (err) {
      console.error('Error loading heatmap data:', err);
      setError('Failed to load contribution heatmap data');
    } finally {
      setLoading(false);
    }
  };

  // Group data by month and week
  const groupedData = heatmapData.reduce((acc: Record<string, Record<string, HeatmapData[]>>, item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const weekKey = Math.floor(date.getDate() / 7);
    
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }
    
    if (!acc[monthKey][weekKey]) {
      acc[monthKey][weekKey] = [];
    }
    
    acc[monthKey][weekKey].push(item);
    return acc;
  }, {});

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Contribution Heatmap</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Commit activity calendar
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
        ) : heatmapData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-neutral-600 dark:text-neutral-400">
            No contribution data available
          </div>
        ) : (
          <>
            <div className="overflow-x-auto pb-4">
              <div className="min-w-max">
                {Object.entries(groupedData).map(([monthKey, weeks]) => (
                  <div key={monthKey} className="mb-6">
                    <h3 className="text-md font-medium mb-2">
                      {new Date(monthKey).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </h3>
                    <div className="grid grid-cols-7 gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-xs text-neutral-500 text-center mb-1">
                          {day}
                        </div>
                      ))}
                      
                      {/* Create a 7x5 grid (days x weeks) */}
                      {Array.from({ length: 35 }).map((_, index) => {
                        const weekIndex = Math.floor(index / 7);
                        const dayIndex = index % 7;
                        
                        // Find matching data for this cell
                        const weekData = weeks[weekIndex] || [];
                        const dayData = weekData.find((item) => {
                          const date = new Date(item.date);
                          return date.getDay() === dayIndex;
                        });
                        
                        return (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-sm flex items-center justify-center text-xs cursor-pointer transition-colors duration-200 relative group"
                            style={{ 
                              backgroundColor: dayData 
                                ? getCellColor(dayData.commits, theme) 
                                : theme === 'dark' ? '#1e293b' : '#f1f5f9',
                            }}
                            onClick={() => setSelectedDate(dayData || null)}
                          >
                            {dayData && dayData.commits > 0 && (
                              <span className="text-[10px] text-white dark:text-white">
                                {dayData.commits > 9 ? '9+' : dayData.commits}
                              </span>
                            )}
                            
                            {dayData && (
                              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 mb-1">
                                {formatDate(dayData.date)}: {dayData.commits} commit{dayData.commits !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-neutral-500">Less</span>
                {[0, 1, 3, 5, 10].map((level) => (
                  <div
                    key={level}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: getCellColor(level, theme) }}
                  ></div>
                ))}
                <span className="text-xs text-neutral-500">More</span>
              </div>
            </div>
            
            {selectedDate && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <h4 className="font-medium">{formatDate(selectedDate.date)}</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {selectedDate.commits} commit{selectedDate.commits !== 1 ? 's' : ''} on this day
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContributionHeatmap;