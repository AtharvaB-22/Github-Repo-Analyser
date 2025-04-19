import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Github className="h-5 w-5 mr-2" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              GitHub Repo Analyzer
            </span>
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-500">
            Powered by GitHub API • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;