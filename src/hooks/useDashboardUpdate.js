import { useEffect, useCallback } from 'react';

const useDashboardUpdate = (onUpdate) => {
  const handleStorageChange = useCallback((e) => {
    if (e.key === 'dashboardUpdate') {
      try {
        const data = JSON.parse(e.newValue);
        if (onUpdate) {
          onUpdate(data);
        }
      } catch (error) {
        console.error('Error parsing dashboard update:', error);
      }
    }
  }, [onUpdate]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);
};

export default useDashboardUpdate;
