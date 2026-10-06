import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-extrabold text-red-600">404</h1>
      <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-sm">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;