import { BarChart2, Code, GitMerge, GitPullRequest, Github, Users } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onChange: (tab: any) => void;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onChange }) => {
  const tabs: Tab[] = [
    { id: 'commits', label: 'Commits', icon: <Github className="h-4 w-4" /> },
    { id: 'contributors', label: 'Contributors', icon: <Users className="h-4 w-4" /> },
    { id: 'languages', label: 'Languages', icon: <Code className="h-4 w-4" /> },
    // { id: 'code', label: 'Code Frequency', icon: <BarChart2 className="h-4 w-4" /> },
    // { id: 'pulls', label: 'Pull Requests', icon: <GitPullRequest className="h-4 w-4" /> },
    { id: 'heatmap', label: 'Contribution Heat Map', icon: <GitMerge className="h-4 w-4" /> },
  ];

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-nowrap overflow-x-auto px-4 py-2 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center whitespace-nowrap px-4 py-2 mx-1 my-1 rounded-md text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'bg-primary-50 text-primary-700 dark:bg-neutral-800 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;