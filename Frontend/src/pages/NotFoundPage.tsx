import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-7xl font-bold text-neutral-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-medium text-neutral-700 dark:text-neutral-300 mb-6">
        Page not found
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn btn-primary"
      >
        <Home className="h-5 w-5 mr-2" />
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;