import React, { useState } from 'react';
import { User, ShoppingCart, Wallet, Settings, Home, Package, Clock, ChevronRight } from 'lucide-react';

const UserDashboard = () => {
  // Sample user data - replace with your actual data
  const userData = {
    name: "Rahul Sharma",
    profileImage: "/api/placeholder/150/150",
    walletBalance: 5280.75,
    cartItems: 3,
    currentPlan: {
      name: "Business Pro",
      status: "Active",
      expiryDate: "2025-05-15",
      progress: 65
    },
    secondaryPlan: {
      name: "Web Hosting Plus",
      status: "Active",
      expiryDate: "2025-08-22",
      progress: 30
    },
    expiredPlans: [
      {
        name: "Basic Plan",
        expiredDate: "2024-12-10"
      }
    ]
  };

  // Active sidebar item state
  const [activeItem, setActiveItem] = useState('dashboard');

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'current-plan', name: 'Current Plan', icon: <Package size={20} /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'wallet', name: 'Wallet', icon: <Wallet size={20} /> },
    { id: 'profile', name: 'Profile', icon: <User size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
    { id: 'expired-plans', name: 'Expired Plans', icon: <Clock size={20} /> },
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-md">
        <div className="p-6 flex flex-col items-center border-b">
          <div className="relative">
            <img 
              src={userData.profileImage} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" 
            />
            <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white"></div>
          </div>
          <h2 className="mt-4 font-bold text-gray-800">{userData.name}</h2>
          <div className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {userData.currentPlan.name}
          </div>
        </div>
        
        <nav className="mt-6">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id} className="px-4 py-2">
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Homepage Link */}
        <div className="mt-6 px-8">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
            Visit Main Homepage
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
              {/* Wallet Balance */}
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Wallet size={18} className="text-green-600 mr-2" />
                <div>
                  <p className="text-xs text-green-600">Wallet Balance</p>
                  <p className="font-bold text-green-700">{formatCurrency(userData.walletBalance)}</p>
                </div>
              </div>
              
              {/* Cart Button */}
              <button className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {userData.cartItems}
                </span>
              </button>
              
              {/* Profile Menu */}
              <button className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
                <img src={userData.profileImage} alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="font-medium">Profile</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan Card - Spans full width */}
          <div className="col-span-full bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Current Plan</h2>
              <button className="text-blue-600 flex items-center text-sm font-medium hover:text-blue-800">
                View Details <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{userData.currentPlan.name}</h3>
                  <p className="text-blue-100 mt-1">Valid until: {userData.currentPlan.expiryDate}</p>
                </div>
                <span className="bg-green-400 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  {userData.currentPlan.status}
                </span>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{userData.currentPlan.progress}%</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2" 
                    style={{ width: `${userData.currentPlan.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Plan Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Secondary Plan</h2>
              <button className="text-blue-600 flex items-center text-sm hover:text-blue-800">
                View <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-4 text-white">
              <h3 className="font-bold">{userData.secondaryPlan.name}</h3>
              <p className="text-purple-100 text-sm mt-1">Valid until: {userData.secondaryPlan.expiryDate}</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{userData.secondaryPlan.progress}%</span>
                </div>
                <div className="w-full bg-purple-800 rounded-full h-1.5">
                  <div 
                    className="bg-white rounded-full h-1.5" 
                    style={{ width: `${userData.secondaryPlan.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Shortcuts */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Our Services</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Web Development', 'App Development', 'Hosting Service', 'Domain'].map((service, index) => (
                <button 
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 flex flex-col items-center justify-center transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
              <button className="text-blue-600 text-sm hover:text-blue-800">View All</button>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                      #{order}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{1000 + order}</p>
                      <p className="text-xs text-gray-500">February 10, 2025</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-medium">₹{order * 1000}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expired Plans */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Expired Plans</h2>
              <button className="text-blue-600 text-sm hover:text-blue-800">View All</button>
            </div>
            
            {userData.expiredPlans.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <div>
                  <p className="font-medium text-gray-800">{plan.name}</p>
                  <p className="text-xs text-gray-500">Expired: {plan.expiredDate}</p>
                </div>
                <button className="text-blue-600 text-sm px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-50">
                  Renew
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;