import { Github, Menu, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../UI/ThemeToggle';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="container-custom flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link 
            to="/"
            className="flex items-center space-x-2 text-neutral-900 dark:text-white"
          >
            <Github className="h-8 w-8" />
            <span className="text-lg font-semibold hidden sm:inline-block">GitHub Repo Analyzer</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`nav-tab ${location.pathname === '/' ? 'nav-tab-active' : ''}`}
            >
              Home
            </Link>
            {location.pathname.includes('/analysis') && (
              <span className="nav-tab nav-tab-active">Analysis</span>
            )}
          </nav>
          <ThemeToggle />
        </div>
        
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button 
            onClick={toggleMenu}
            className="ml-2 p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 animate-fade-in">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`nav-tab ${location.pathname === '/' ? 'nav-tab-active' : ''}`}
              >
                Home
              </Link>
              {location.pathname.includes('/analysis') && (
                <span className="nav-tab nav-tab-active">Analysis</span>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;