import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const EmptyDashboard = ({ onStartProject, walletBalance = 0 }) => {
  const user = useSelector(state => state?.user?.user);
  const cartProductCount = useSelector(state => state?.cart?.cartProductCount) || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <button 
              onClick={onStartProject}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Explore
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
              <div>
                <p className="text-xs text-green-600">Wallet Balance</p>
                <p className="font-bold text-green-700">₹{walletBalance}</p>
              </div>
            </div>
            
            {/* Cart Button */}
            <Link to="/cart" className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <ShoppingCart size={22} />
              {cartProductCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartProductCount}
                </span>
              )}
            </Link>
            
            {/* Profile Menu */}
            <Link to="/profile" className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <img 
                src={user?.profilePic || "/api/placeholder/150/150"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full" 
              />
              <span className="font-medium">{user?.name || "Profile"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content - Simple 2-card layout */}
      <main className="p-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Start a New Project Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Start a New Project</h2>
            <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Plus size={30} className="text-blue-600" />
              </div>
              <p className="text-center text-gray-600 mb-6">
                You haven't started any projects yet. Click the button below to start a new project.
              </p>
              <button 
                onClick={onStartProject}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Start Project
              </button>
            </div>
          </div>

          {/* Empty Orders Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Your Orders</h2>
              <Link to="/orders" className="text-blue-600 text-sm hover:text-blue-800">View All</Link>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 h-48">
              <ShoppingCart size={40} className="text-gray-400 mb-3" />
              <p className="text-gray-500 text-center">
                You don't have any orders yet.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmptyDashboard;