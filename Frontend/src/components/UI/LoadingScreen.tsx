const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="spinner"></div>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm">Loading...</p>
    </div>
  );
};

export default LoadingScreen;