// App.js
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import AppContent from './AppContent';
import { createContext, useContext, useState, useEffect } from 'react';

// Create a simple context for online status
export const OnlineStatusContext = createContext();

function App() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initialized after checking online status
    setIsInitialized(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={{ isOnline, isInitialized }}>
      <AppContent />
    </OnlineStatusContext.Provider>
  );
}

// Custom hook for easy access
export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error('useOnlineStatus must be used within OnlineStatusProvider');
  }
  return context;
};

export default App;