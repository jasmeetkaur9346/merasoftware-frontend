import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    'In Progress': { 
      color: 'bg-blue-500 text-white', 
      icon: <RefreshCw size={14} className="mr-1" /> 
    },
    'Rejected': { 
      color: 'bg-red-500 text-white', 
      icon: <AlertCircle size={14} className="mr-1" /> 
    },
    'Processing': { 
      color: 'bg-gray-500 text-white', 
      icon: <Clock size={14} className="mr-1" /> 
    },
    'Completed': { 
      color: 'bg-green-500 text-white', 
      icon: <CheckCircle size={14} className="mr-1" /> 
    }
  };

  const config = statusConfig[status] || statusConfig['Processing'];

  return (
    <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status}
    </span>
  );
};

const OrderItem = ({ order }) => {
  const handleClick = () => {
    // Handle click event - could navigate to order details page
    console.log(`Order ${order.id} clicked`);
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{order.title}</h3>
            <p className="text-sm text-gray-500">{order.category}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-2" />
            {order.date}
          </div>
          
          <div className="flex items-center text-sm text-blue-600">
            <Eye size={16} className="mr-1" />
            View Details
          </div>
        </div>
      </div>
    </button>
  );
};

const OrdersApp = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const orders = [
    { 
      id: 1, 
      title: 'Restaurant Website', 
      category: 'standard websites', 
      date: '22/03/2025', 
      status: 'In Progress' 
    },
    { 
      id: 2, 
      title: 'Restaurant Website', 
      category: 'standard websites', 
      date: '22/03/2025', 
      status: 'Rejected' 
    },
    { 
      id: 3, 
      title: 'Website Update - Basic Plan', 
      category: 'website updates', 
      date: '16/03/2025', 
      status: 'Processing' 
    },
    { 
      id: 4, 
      title: 'Appointment Booking Website', 
      category: 'dynamic websites', 
      date: '12/03/2025', 
      status: 'Completed' 
    },
    { 
      id: 5, 
      title: 'Dynamic Gallery', 
      category: 'feature upgrades', 
      date: '12/03/2025', 
      status: 'Processing' 
    },
    { 
      id: 6, 
      title: 'Dynamic Page with Panel', 
      category: 'feature upgrades', 
      date: '12/03/2025', 
      status: 'Processing' 
    },
    { 
      id: 7, 
      title: 'Restaurant Website', 
      category: 'standard websites', 
      date: '12/03/2025', 
      status: 'Completed' 
    }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => 
        activeTab === 'completed' 
          ? order.status === 'Completed' 
          : order.status !== 'Completed'
      );
      
  // Determine grid columns based on screen width
  let gridColsClass = "grid-cols-1";
  
  if (windowWidth >= 640 && windowWidth < 1024) {
    gridColsClass = "grid-cols-2";
  } else if (windowWidth >= 1024) {
    gridColsClass = "grid-cols-3";
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-blue-600 text-white py-4 sm:py-6 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
          <p className="text-blue-100 text-sm sm:text-base mt-1">Manage and track your website development orders</p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:px-8">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex min-w-max space-x-1 md:space-x-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md transition-colors ${
                activeTab === 'all' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Orders
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md transition-colors ${
                activeTab === 'active' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-3 sm:mb-4">
          {activeTab === 'all' ? 'Recent Orders' : 
           activeTab === 'active' ? 'Active Orders' : 'Completed Orders'}
        </h2>
        
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {filteredOrders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersApp;