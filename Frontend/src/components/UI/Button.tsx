import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:ring-neutral-700',
    outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:ring-neutral-500',
    ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:ring-neutral-500',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-5 py-2.5 rounded-md',
  };
  
  const spinnerSize = {
    sm: 'w-3 h-3 border-2',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-2',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className={`spinner mr-2 ${spinnerSize[size]}`} aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Button;