import React, { useContext, useEffect, useRef, useState } from 'react'
import Logo from '../assest/newlogo.png'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common'; 
import { toast } from 'react-toastify';
import { setUserDetails, logout, updateUserRole } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { useOnlineStatus } from '../App'; 
import { IoWalletOutline } from "react-icons/io5";
import CookieManager from '../utils/cookieManager';
import StorageService from '../utils/storageService';
import displayCurrency from "../helpers/displayCurrency" 
import NotificationBell from './NotificationBell';
import LoginPopup from '../components/LoginPopup';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const { isOnline } = useOnlineStatus();
  const context = useContext(Context);
  const activeProject = context.activeProject;
  const navigate = useNavigate();
  const [menuDisplay,setMenuDisplay] = useState(false);
  const dropdownRef = useRef(null); // For notification dropdown
  const menuRef = useRef(null); // New ref for menu dropdown
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)
  const [serviceTypes, setServiceTypes] = useState([])
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  // Get user authentication status
  const userDetails = useSelector((state) => state.user.user);
  const isAuthenticated = !!userDetails?._id;
  const isInitialized = useSelector((state) => state.user.initialized);

  // console.log("Header using context.activeProject:", activeProject);

  const location = useLocation();
  // const showBackButton = location.pathname !== '/';
    const currentPath = location.pathname;

  const onBack = () => {
    navigate(-1); 
  };

   const getProjectLink = () => {
    // If activeProject is available in context
    if (activeProject && activeProject._id) {
      // console.log("Using activeProject from context:", activeProject._id);
      return `/project-details/${activeProject._id}`;
    }
    // If user is already on a project details page
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/project-details/')) {
      // console.log("Using current path:", currentPath);
      return currentPath;
    }
    
    // Fallback
    // console.log("Falling back to /order");
    return '/order';
  };

  // Function to build query string for service type categories
  const buildCategoryQueryString = (categoryValues) => {
    if (!categoryValues || categoryValues.length === 0) return '';
    return categoryValues.map(val => `category=${val}`).join('&&');
  };


   // Handle protected navigation
  const handleProtectedNavigation = (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (isInitialized && !userDetails) {
      // Show login popup
      setShowLoginPopup(true);
    } else {
      // User is authenticated, navigate to the path
      window.location.href = e.currentTarget.href;
    }
  };


  // Fetch service types for navigation
  useEffect(() => {
    const loadServiceTypes = async () => {
      // First check if we have cached categories
      const cachedCategories = StorageService.getProductsData('categories');
      
      if (cachedCategories) {
        processCategories(cachedCategories);
        setLoading(false);
      }

      // If online, fetch fresh data
      if (isOnline) {
        try {
          const response = await fetch(SummaryApi.allCategory.url);
          const data = await response.json();
          
          if (data.success) {
            StorageService.setProductsData('categories', data.data);
            processCategories(data.data);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadServiceTypes();
  }, [isOnline]);

    
  // Add this effect for handling clicks outside and ESC key press
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuDisplay) {
        setMenuDisplay(false);
      }
      if (roleDropdownOpen && !event.target.closest('.role-dropdown')) {
        setRoleDropdownOpen(false);
      }
    };
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (menuDisplay) setMenuDisplay(false);
        if (roleDropdownOpen) setRoleDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [menuDisplay, roleDropdownOpen]);

  // Process categories to extract service types
  const processCategories = (data) => {
    // Extract unique service types
    const uniqueServiceTypes = [...new Set(data.map(item => item.serviceType))];
    
    // Create service type objects with associated categories
    const serviceTypeObjects = uniqueServiceTypes.map(type => {
      const typeCategories = data.filter(cat => cat.serviceType === type);
      
      return {
        serviceType: type,
        queryCategoryValues: typeCategories.map(cat => cat.categoryValue),
      };
    });
    
    setServiceTypes(serviceTypeObjects);
  };

  const handleLogout = async () => {
    try {
      // 1. Save guest slides before logout
      const guestSlides = StorageService.getGuestSlides();
      if (guestSlides && guestSlides.length > 0) {
        try {
          // Store in multiple locations for backup
          sessionStorage.setItem('sessionGuestSlides', JSON.stringify(guestSlides));
          localStorage.setItem('preservedGuestSlides', JSON.stringify(guestSlides));
          localStorage.setItem('guestSlides', JSON.stringify(guestSlides)); 
          localStorage.setItem('lastLogoutTimestamp', Date.now().toString());
        } catch (backupError) {
          console.error('Failed to backup slides:', backupError);
        }
      }
  
      // 2. Call logout API if online
      if (isOnline) {
        const response = await fetch(SummaryApi.logout_user.url, {
          method: SummaryApi.logout_user.method,
          credentials: 'include'
        });
    
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
        }
      }

      // 3. Clear cookies
      CookieManager.clearAll();
      
      // 4. Clear user data from localStorage
      StorageService.clearUserData();
      
      // 5. Verify guest slides are preserved
      const preserved = localStorage.getItem('preservedGuestSlides');
      const sessionBackup = sessionStorage.getItem('sessionGuestSlides');
      
      if (!localStorage.getItem('guestSlides')) {
        if (preserved) {
          localStorage.setItem('guestSlides', preserved);
        } else if (sessionBackup) {
          localStorage.setItem('guestSlides', sessionBackup);
        }
      }
      
      // 6. Reset states and navigate
      dispatch(logout());
      setMenuDisplay(false);
      setSearch('');
      navigate("/");
      
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  
const handleSearch = (e) =>{
const { value } = e.target
setSearch(value)

if(value){
  navigate(`/search?q=${value}`)
  }else{
    navigate("/search")
  }
}
const handleRoleChange = async (newRole) => {
  if(newRole === user.role) {
    setRoleDropdownOpen(false);
    return;
  }
  try {
    setIsRoleSwitching(true); 

    const response = await fetch(SummaryApi.userRoleSwitch.url, {
      method: SummaryApi.userRoleSwitch.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newRole })
    });
    const data = await response.json();
    if(data.success) {
      // Update Redux state with new role
      dispatch(updateUserRole(newRole));
      // Optionally update user details in localStorage
      const updatedUser = { ...user, role: newRole };
      StorageService.setUserDetails(updatedUser);
      dispatch(setUserDetails(updatedUser));
      toast.success("Role switched to " + newRole);
      setRoleDropdownOpen(false);
      // Update user-details cookie to keep in sync
      CookieManager.setUserDetails({ ...user, role: newRole });

      // Check if userDetails.isDetailsCompleted is false and role is not customer
      const isDetailsCompleted = user.userDetails?.isDetailsCompleted || false;
      if (!isDetailsCompleted && newRole !== "customer") {
        setTimeout(() => {
          navigate("/complete-profile");
          setIsRoleSwitching(false); 
        }, 100);
      } else {
        // Redirect based on new role
        let redirectPath = "/";
        switch(newRole) {
          case ROLE.ADMIN:
            redirectPath = '/admin-panel/all-products';
            break;
          case ROLE.MANAGER:
            redirectPath = '/manager-panel/dashboard';
            break;
          case ROLE.PARTNER:
            redirectPath = '/partner-panel/dashboard';
            break;
          case ROLE.DEVELOPER:
            redirectPath = '/developer-panel';
            break;
          case ROLE.CUSTOMER:
            redirectPath = '/home';
            break;
        }
        // console.log("Redirecting to path:", redirectPath);
        // Add small delay to allow Redux state update to propagate
        setTimeout(() => {
          navigate(redirectPath);
          setIsRoleSwitching(false);
        }, 100);
      }
    } else {
      toast.error(data.message || "Failed to switch role");
      setIsRoleSwitching(false);
    }
  } catch (error) {
    console.error("Error switching role:", error);
    toast.error("Error switching role");
    setIsRoleSwitching(false);
  }
  setRoleDropdownOpen(false);
};

// useEffect(() => {
//   if (user?._id) {
//     context.fetchWalletBalance();
//   }
// }, []); 

  return (
    <>
     {/* Add TriangleMazeLoader for role switching */}
    {isRoleSwitching && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <TriangleMazeLoader />
      </div>
    )}

    <header className='hidden md:block bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6'>

       <div className="py-4 flex items-center justify-between">
       <Link to={"/"}>
       <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-gray-800">MeraSoftware</span>
            </div>
        </Link>

         {/* Role Switch Dropdown */}
        {user?.roles && user.roles.length > 1 && (
          <div className="relative role-dropdown">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="ml-4 px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {user.role.toUpperCase()} ▼
            </button>
            {roleDropdownOpen && !isRoleSwitching &&(
              <ul className="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                {user.roles.map((roleItem) => (
                  <li
                    key={roleItem}
                    className={`cursor-pointer px-4 py-2 hover:bg-blue-600 hover:text-white ${
                      roleItem === user.role ? 'font-bold bg-blue-100' : ''
                    }`}
                    onClick={() => handleRoleChange(roleItem)}
                  >
                    {roleItem.toUpperCase()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


       <div className='hidden md:flex flex-1 max-w-xl mx-8'>
        <div className="relative w-full">
       <input type='text' placeholder='Search for services...' className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' onChange={handleSearch} value={search}/>
       <GrSearch size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
       </div>


       <div className="flex items-center space-x-6">

       {/* Add Wallet Balance Display */}
       <Link to={"/wallet"}>
       {user?._id && (
          <div className='flex items-center gap-2 px-3 py-1 rounded-full'>
            <IoWalletOutline className="text-xl text-green-600" />
            <span className='font-medium text-green-600'>{displayCurrency (context.walletBalance)}</span>
          </div>
        )}
        </Link>
          <div className='relative flex justify-center'>
               {
                    user?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                      </div>
                    )
                  }

    {
      menuDisplay && (
        <div className='absolute bg-white bottom-0 w-44 top-11 h-fit p-2 shadow-lg rounded' ref={menuRef}>
        <nav>
            {
                user?.role === ROLE.ADMIN && (
                    <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                )
            } 
            {
                user?.role === ROLE.MANAGER && (
                    <Link to={"/manager-panel/dashboard"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Manager Panel</Link>
                )
            }
            {
                user?.role === ROLE.PARTNER && (
                    <Link to={"/partner-panel/dashboard"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Partner Panel</Link>
                )
            } 
            {
            user?.role === ROLE.DEVELOPER && (
                <Link to={"/developer-panel"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Developer Panel</Link>
            )
        }
            <Link to={'/order'} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Settings</Link>  
            {/* Add Wallet Balance in Menu too */}
            <div className='p-2 hover:bg-slate-100 flex items-center gap-2'>
                <IoWalletOutline />
                <span>Balance: ₹{context.walletBalance}</span>
              </div>
            </nav>
      </div>
    )
  }
    </div>

            <NotificationBell/>
          {/* {user?._id && (
              <Link to={"/cart"} className='text-2xl relative'>
             <span><FaShoppingCart/></span>
          
          <div className='bg-blue-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
            <p className='text-sm'>{context?.cartProductCount}</p>
        </div>
          </Link>
            )} */}
     

     <div className='hidden md:block'>
    {
        user?._id ? (
            <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700'>Logout</button>
        ): (
            <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700'>Login</Link>
        )
    }
    </div>


       </div>

       </div>

{user?.role !== ROLE.PARTNER && (
       <nav className="border-t py-3">
            <ul className="flex justify-between overflow-x-auto scrollbar-none">
              <li><a href="/dashboard"
              onClick={handleProtectedNavigation}
               className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">My Dashboard</a></li>
              <li><a href="/order" 
              onClick={handleProtectedNavigation}
              className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">My Orders</a></li>
              <li><Link to={getProjectLink()} 
              onClick={handleProtectedNavigation}
              className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">My Projects</Link></li>
              <li><a href="/wallet" 
              onClick={handleProtectedNavigation}
              className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">My Wallet</a></li>
              <li><a href="/support" 
              onClick={handleProtectedNavigation}
              className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Contact Support</a></li>
             {/* Dynamically render service types from CategoryList */}
             {/* {serviceTypes.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={`/product-category?${buildCategoryQueryString(service.queryCategoryValues)}`} 
                    className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3"
                  >
                    {service.serviceType}
                  </Link>
                </li>
              ))} */}
            </ul>
          </nav>
)}
          
       </div>
    </header>

    {/* Mobile Search Bar with Login and Dynamic Back Button */}

    <header className="md:hidden bg-white shadow-sm px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Link to={"/"}>
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md mr-2">
              M
            </div>
            <span className="font-bold text-lg">MeraSoftware</span>
          </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            
            {/* <div className="relative">
              <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
              </button>
            </div> */}
            

            {/* <Link to={user?._id ? "/profile" : "/login"}>
  {user?._id ? (
    <div className="flex flex-col items-center cursor-pointer">
      {user?.profilePic ? (
        <img src={user?.profilePic} className="w-8 h-8 rounded-full" alt={user?.name} />
      ) : (
        <UserCircle className="w-8 h-8 " />
      )}
     
    </div>
  ) : (
    <div className="flex flex-col items-center cursor-pointer">
      <FiUser className="w-6 h-6 " />
      
    </div>
  )}
        </Link> */}
          </div>
        </div>
        
        {/* Search Bar - Below top nav */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search projects, orders..."
            className="w-full py-2 px-4 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <GrSearch size={16} />
          </div>
        </div>
      </header>

    {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
      </>
  )
}

export default Header;