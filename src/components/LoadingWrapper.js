import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TriangleMazeLoader from './TriangleMazeLoader';

const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);
    
    // Hide loader after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [location.pathname]); // Trigger when route changes

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <TriangleMazeLoader />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};

export default LoadingWrapper;