import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="bg-error-50 dark:bg-neutral-800 p-6 rounded-xl max-w-md">
        <AlertTriangle className="h-12 w-12 text-error-500 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;