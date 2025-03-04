import React, { useContext, useState } from 'react'
import Logo from '../assest/newlogo.png'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common'; 
import { toast } from 'react-toastify';
import { setUserDetails, logout  } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useOnlineStatus } from '../App'; 
import { IoWalletOutline } from "react-icons/io5";
import CookieManager from '../utils/cookieManager';
import StorageService from '../utils/storageService';
import {  Bell, UserCircle } from 'lucide-react';


const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const { isOnline } = useOnlineStatus();
  const context = useContext(Context)
  const navigate = useNavigate()
  const [menuDisplay,setMenuDisplay] = useState(false)
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)

  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  const onBack = () => {
    navigate(-1); 
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

// useEffect(() => {
//   if (user?._id) {
//     context.fetchWalletBalance();
//   }
// }, []); 
  return (
    <>

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


       <div className='hidden md:flex flex-1 max-w-xl mx-8'>
        <div className="relative w-full">
       <input type='text' placeholder='Search for services...' className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' onChange={handleSearch} value={search}/>
       <GrSearch size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
       </div>


       <div className="flex items-center space-x-6">

       {/* Add Wallet Balance Display */}
       {user?._id && (
              <div className='flex items-center gap-2 px-3 py-1 rounded-full'>
                <IoWalletOutline className="text-xl text-green-600" />
                <span className='font-medium text-green-600'>₹{context.walletBalance}</span>
              </div>
            )}

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
        <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
        <nav>
            {
                user?.role === ROLE.ADMIN && (
                    <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                )
            } 
            <Link to={'/order'} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Order</Link>  
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


          {
            user?._id && (
              <Link to={"/cart"} className='text-2xl relative'>
             <span><FaShoppingCart/></span>
          
          <div className='bg-blue-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
            <p className='text-sm'>{context?.cartProductCount}</p>
        </div>
          </Link>
            )
          }
     

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

       <nav className="border-t py-3">
            <ul className="flex justify-between overflow-x-auto scrollbar-none">
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">All Services</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Website Development</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Web App Development</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Mobile App Development</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Features & Upgrades</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Special Offers</a></li>
            </ul>
          </nav>
          
       </div>
    </header>

    {/* Mobile Search Bar with Login and Dynamic Back Button */}

    <header className="md:hidden bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md mr-2">
              M
            </div>
            <span className="font-bold text-lg">MeraSoftware</span>
          </div>
          
          <div className="flex items-center space-x-3">
            
            <div className="relative">
              <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
              </button>
            </div>
            

            <Link to={"/login"}>
        {
                    user?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-8 h-8 rounded-full' alt={user?.name} />
                          ) : (
                            <UserCircle className="text-white text-2xl"/>
                          )
                        }
                      </div>
                    )
                  }
                  
        </Link>
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

      </>
  )
}

export default Header
