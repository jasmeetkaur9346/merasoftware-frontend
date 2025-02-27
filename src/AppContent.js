import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useOnlineStatus } from './App';
import { setUserDetails, updateWalletBalance, logout } from './store/userSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import SummaryApi from './common';
import Context from './context';
import CookieManager from './utils/cookieManager';
import StorageService from './utils/storageService';

const STORAGE_KEYS = {
  WALLET_BALANCE: 'walletBalance',
  USER_DETAILS: 'userDetails',
  GUEST_SLIDES: 'guestSlides'
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isOnline, isInitialized } = useOnlineStatus(); 
  const [cartProductCount, setCartProductCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: 'include'
      });
      
    
      if (response.ok) {
        // Clear cookies
        CookieManager.clearAll();
        
        // Clear localStorage but preserve essential data
        StorageService.clearAll();

        // Clear session cookie
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        setWalletBalance(0);
      dispatch(updateWalletBalance(0));
      dispatch(logout());
      setCartProductCount(0);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const initializeWalletBalance = async () => {
      if (!isInitialized) return;
      
      // Check if user is logged in
      const sessionCookie = document.cookie.includes('user-details');
      if (!sessionCookie) return;
  
      // Get cached balance first
      const cachedBalance = StorageService.getWalletBalance();
      if (cachedBalance !== null) {
        setWalletBalance(cachedBalance);
        dispatch(updateWalletBalance(cachedBalance));
      }
  
      // Then fetch fresh balance if online
      if (isOnline) {
        await fetchWalletBalance();
      }
    };
  
    initializeWalletBalance();
  }, [isInitialized, isOnline]);
  
  // 2. Modify the fetchWalletBalance function
  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(SummaryApi.wallet.balance.url, {
        method: SummaryApi.wallet.balance.method,
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        const balance = data.data.balance;
        setWalletBalance(balance);
        dispatch(updateWalletBalance(balance));
        StorageService.setWalletBalance(balance); // Always update storage on successful fetch
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      // On error, try to use cached balance
      const cachedBalance = StorageService.getWalletBalance();
      if (cachedBalance !== null) {
        setWalletBalance(cachedBalance);
        dispatch(updateWalletBalance(cachedBalance));
      }
    }
  };

  const fetchUserDetails = async () => {
    try {
      // First check localStorage
      const cachedDetails = StorageService.getUserDetails();
      if (cachedDetails) {
        dispatch(setUserDetails(cachedDetails));
        setWalletBalance(cachedDetails.walletBalance || 0);
        dispatch(updateWalletBalance(cachedDetails.walletBalance || 0));
      }

      // If online, fetch fresh data
      if (isOnline) {
        const dataResponse = await fetch(SummaryApi.current_user.url, {
          method: SummaryApi.current_user.method,
          credentials: 'include'
        });
        const dataApi = await dataResponse.json();
        
        if (dataApi.success && dataApi.data) {
          // Save to cookies
          CookieManager.setUserDetails({
            _id: dataApi.data._id,
            name: dataApi.data.name,
            email: dataApi.data.email,
            role: dataApi.data.role
          });

          // Save to localStorage
          StorageService.setUserDetails(dataApi.data);
          dispatch(setUserDetails(dataApi.data));
          
          // Update wallet balance if it exists
          if (dataApi.data.walletBalance !== undefined) {
            setWalletBalance(dataApi.data.walletBalance);
            dispatch(updateWalletBalance(dataApi.data.walletBalance));
            StorageService.setWalletBalance(dataApi.data.walletBalance);
          }
          
          // Fetch latest wallet balance
          await fetchWalletBalance();
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      // First check localStorage
      const cachedCount = StorageService.getCartCount();
      setCartProductCount(cachedCount);

      // If online, fetch fresh data
      if (isOnline) {
        const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
          method: SummaryApi.addToCartProductCount.method,
          credentials: 'include'
        });
        const dataApi = await dataResponse.json();
        const newCount = dataApi?.data?.count || 0;
        setCartProductCount(newCount);
        StorageService.setCartCount(newCount);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!isInitialized) return;

        // यहाँ localStorage की checking से पहले COOKIE check करें
        const sessionCookie = document.cookie.includes('user-details');
        if (!sessionCookie) {
          // If no session cookie, clear everything and logout
          StorageService.clearUserData();
          dispatch(logout());
          return;
        }

        // Try to get user data from localStorage first
        const cachedUser = StorageService.getUserDetails();
        if (cachedUser) {
          dispatch(setUserDetails(cachedUser));
          await fetchUserAddToCart();
          return;
        }

        // If online, verify user session
        if (isOnline) {
          const userResponse = await fetch(SummaryApi.current_user.url, {
            method: SummaryApi.current_user.method,
            credentials: 'include'
          });
          
          if (!userResponse.ok) {
            dispatch(logout());
            await fetchUserAddToCart();
            return;
          }
          
          await fetchUserDetails();
          await fetchUserAddToCart();
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        dispatch(logout());
      }
    };
    
    initializeData();
  }, [isInitialized]);


  return (
     <Context.Provider value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
        walletBalance,
        setWalletBalance, // Add this to allow components to update wallet balance
        fetchWalletBalance,
        handleLogout
      }}>
        <ToastContainer
         position='top-center' 
         autoClose={1000}
         />
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-24 md:pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
  )
}

export default AppContent