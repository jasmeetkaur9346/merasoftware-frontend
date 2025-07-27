import React, { useEffect, useState } from 'react'
import { FaRegCircleUser, FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import { MdDashboard, MdAdminPanelSettings, MdShoppingCart, MdPeople, MdWeb } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    const location = useLocation()
    
    // State for collapsible sections - only one can be open at a time
    const [openSection, setOpenSection] = useState(null)

    useEffect(() => {
        // Assuming user.roles is an array of strings
        if (!user?.roles?.includes(ROLE.ADMIN)) { 
            navigate("/");
        }
    }, [user, navigate]);

    // Function to check if current path matches the link
    const isActive = (path) => {
        const currentPath = location.pathname
        const basePath = '/admin-panel' // Adjust according to your base admin path
        
        if (path === '') {
            // For dashboard, check if we're at the base admin path
            return currentPath === basePath || currentPath === `${basePath}/`
        }
        
        return currentPath.includes(path)
    }

    // Function to determine which section should be open based on current route
    useEffect(() => {
        const currentPath = location.pathname
        
        if (currentPath.includes('coupon-management') || 
            currentPath.includes('payment-verification') || 
            currentPath.includes('order-approval') ||
            currentPath.includes('admin-settings') ||
            currentPath.includes('admin-tickets') ||
            currentPath.includes('partner-withdrawal-requests') ||
            currentPath.includes('wallet-management') ||
            currentPath.includes('update-requests') ||
            currentPath.includes('projects')) {
            setOpenSection('adminPanel')
        } else if (currentPath.includes('all-categories') || 
                   currentPath.includes('all-products')) {
            setOpenSection('productManagement')
        } else if (currentPath.includes('admins') || 
                   currentPath.includes('managers') || 
                   currentPath.includes('customers') ||
                   currentPath.includes('developers') ||
                   currentPath.includes('partners')) {
            setOpenSection('userManagement')
        } else if (currentPath.includes('welcome-content') || 
                   currentPath.includes('all-ads')) {
            setOpenSection('websiteManagement')
        }
    }, [location.pathname])

    const toggleSection = (section) => {
        // If clicking on already open section, close it. Otherwise open the new section
        setOpenSection(prev => prev === section ? null : section)
    }

    return (
        <div className='min-h-[calc(100vh-100px)] md:flex hidden'>
            <aside className='bg-slate-800 min-h-full w-full max-w-60 text-white overflow-y-auto'>
                {/* User Profile Section */}
                <div className='h-32 flex justify-center items-center flex-col border-b border-slate-700'>
                    <div className='text-4xl cursor-pointer relative flex justify-center mb-2'>
                        {
                            user?.profilePic ? (
                                <img src={user?.profilePic} className='w-16 h-16 rounded-full border-2 border-blue-500' alt={user?.name} />
                            ) : (
                                <FaRegCircleUser className='text-gray-300'/>
                            )
                        }        
                    </div>
                    <p className=' text-xl font-semibold text-white'>{user?.name}</p>
                    <p className='text-sm capitalize text-gray-400'>{user?.role}</p>
                </div>

                {/* Navigation */}
                <div className='p-2'>
                    <nav className='space-y-1'>
                        {/* Dashboard */}
                        <Link 
                            to={""} 
                            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive('') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <MdDashboard className='mr-3 text-lg' />
                            Dashboard
                        </Link>

                        {/* Admin Panel Section */}
                        <div className='mt-6'>
                            <button 
                                onClick={() => toggleSection('adminPanel')}
                                className='flex items-center justify-between w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors'
                            >
                                <div className='flex items-center'>
                                    <MdAdminPanelSettings className='mr-3 text-lg' />
                                    Admin Panel
                                </div>
                                {openSection === 'adminPanel' ? <FaChevronUp className='text-xs' /> : <FaChevronDown className='text-xs' />}
                            </button>
                            
                            {openSection === 'adminPanel' && (
                                <div className='ml-6 mt-2 border-l-2 border-blue-500 pl-4 space-y-1'>
                                    <Link 
                                        to={"coupon-management"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('coupon-management')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Coupon Codes
                                    </Link>
                                    <Link 
                                        to={"payment-verification"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('payment-verification')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Payment Verification
                                    </Link>
                                    <Link 
                                        to={"partner-withdrawal-requests"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('partner-withdrawal-requests')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Partner Requests
                                    </Link>
                                    {/* <Link 
                                        to={"order-approval"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('order-approval')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Pending Orders
                                    </Link> */}
                                    <Link 
                                        to={"admin-settings"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('admin-settings')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Storage Settings
                                    </Link>
                                    <Link 
                                        to={"admin-tickets"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('admin-tickets')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Support Panel
                                    </Link>
                                    <Link 
                                        to={"wallet-management"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('wallet-management')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Wallet & Payments
                                    </Link>
                                    <Link 
                                        to={"update-requests"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('update-requests')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Website Update Requests
                                    </Link>
                                    <Link 
                                        to={"projects"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('projects')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Website Projects
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Product Management Section */}
                        <div className='mt-4'>
                            <button 
                                onClick={() => toggleSection('productManagement')}
                                className='flex items-center justify-between w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors'
                            >
                                <div className='flex items-center'>
                                    <MdShoppingCart className='mr-3 text-lg' />
                                    Product Management
                                </div>
                                {openSection === 'productManagement' ? <FaChevronUp className='text-xs' /> : <FaChevronDown className='text-xs' />}
                            </button>
                            
                            {openSection === 'productManagement' && (
                                <div className='ml-6 mt-2 border-l-2 border-blue-500 pl-4 space-y-1'>
                                    <Link 
                                        to={"all-categories"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('all-categories')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        All Services
                                    </Link>
                                    <Link 
                                        to={"all-products"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('all-products')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        All Products
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* User Management Section */}
                        <div className='mt-4'>
                            <button 
                                onClick={() => toggleSection('userManagement')}
                                className='flex items-center justify-between w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors'
                            >
                                <div className='flex items-center'>
                                    <MdPeople className='mr-3 text-lg' />
                                    User Management
                                </div>
                                {openSection === 'userManagement' ? <FaChevronUp className='text-xs' /> : <FaChevronDown className='text-xs' />}
                            </button>
                            
                            {openSection === 'userManagement' && (
                                <div className='ml-6 mt-2 border-l-2 border-blue-500 pl-4 space-y-1'>
                                    <Link 
                                        to={"admins"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('admins')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Admins
                                    </Link>
                                    <Link 
                                        to={"managers"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('managers')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Managers
                                    </Link>
                                    <Link 
                                        to={"customers"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('customers')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Customers
                                    </Link>
                                    <Link 
                                        to={"developers"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('developers')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Developers
                                    </Link>
                                    <Link 
                                        to={"partners"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('partners')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Partners
                                    </Link>
                                     <Link 
                                        to={"all-developers"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('partners')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        All Developers
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Website Management Section */}
                        <div className='mt-4'>
                            <button 
                                onClick={() => toggleSection('websiteManagement')}
                                className='flex items-center justify-between w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors'
                            >
                                <div className='flex items-center'>
                                    <MdWeb className='mr-3 text-lg' />
                                    Website Management
                                </div>
                                {openSection === 'websiteManagement' ? <FaChevronUp className='text-xs' /> : <FaChevronDown className='text-xs' />}
                            </button>
                            
                            {openSection === 'websiteManagement' && (
                                <div className='ml-6 mt-2 border-l-2 border-blue-500 pl-4 space-y-1'>
                                    <Link 
                                        to={"welcome-content"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('welcome-content')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Welcome Content
                                    </Link>
                                    <Link 
                                        to={"all-ads"} 
                                        className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                                            isActive('all-ads')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        All Banner Ads
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </aside>
            
            <main className='w-full h-full p-6 bg-gray-50'>
                <Outlet/>
            </main>
        </div>
    )
}

export default AdminPanel