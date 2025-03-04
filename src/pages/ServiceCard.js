import React, { useState } from 'react';

const ProductCard = ({ website }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  // Determine if we need to show the "Show More" button
  const hasMoreFeatures = website.features.length > 5;
  const displayFeatures = showAllFeatures ? website.features : website.features.slice(0, 5);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-200">
      {/* Card Header */}
      <div className="flex flex-col justify-start text-left bg-blue-50 px-2 py-3 border-b border-gray-200">
        <h3 className="md:text-lg text-xs font-bold text-left text-gray-800">{website.title}</h3>
        <p className="text-xs text-gray-500 mt-1 text-left">{website.type}</p>
      </div>
      
      {/* Features Section */}
      <div className="p-2 flex-grow">
        <div className="mb-2 pb-2 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-700">Package Includes:</p>
        </div>
        <ul className="text-sm space-y-2 mb-2">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-3 w-3 text-teal-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-xs md:text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Show More button if needed */}
        {hasMoreFeatures && (
          <button 
            onClick={() => setShowAllFeatures(!showAllFeatures)} 
            className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          >
            {showAllFeatures ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      
      {/* Price Section - Now below features with improved layout */}
      <div className="px-2 pb-4 border-t border-gray-100 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg px-2 py-1 inline-flex items-center">
              <span className="text-sm font-bold text-blue-800">₹{website.price.toLocaleString()}</span>
            </div>
            {website.originalPrice && (
              <div className="ml-2">
                <span className="text-xs text-gray-500 line-through">
                  ₹{website.originalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          {website.discount && (
            <div className="hidden bg-teal-100 px-2 py-1 rounded">
              <span className="font-medium text-teal-700">
                {website.discount}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Button Section - Hidden on mobile */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 hidden sm:block">
        <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          View Details
        </button>
      </div>
    </div>
  );
};

const WebsiteGrid = () => {
  // Data from the image
  const [websites] = useState([
    {
      id: 1,
      title: "Local Service Website",
      type: "Standard Websites",
      price: 8999,
      originalPrice: 15000,
      discount: 40,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance",
        "User Friendly"
      ]
    },
    {
      id: 2,
      title: "Landing Page Website",
      type: "Standard Websites",
      price: 13599,
      originalPrice: 16000,
      discount: 15,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance",
        "Live Chat"
      ]
    },
    {
      id: 3,
      title: "Personal Brand Website",
      type: "Standard Websites",
      price: 8999,
      originalPrice: 15000,
      discount: 40,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance"
      ]
    },
    {
      id: 4,
      title: "Educational Website",
      type: "Standard Websites",
      price: 23000,
      originalPrice: 30000,
      discount: 23,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance"
      ]
    },
    {
      id: 5,
      title: "Non-Profit Website",
      type: "Standard Websites",
      price: 9599,
      originalPrice: 35000,
      discount: 72,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance"
      ]
    },
    {
      id: 6,
      title: "Blogging Website",
      type: "Dynamic Websites",
      price: 35000,
      originalPrice: 70000,
      discount: 50,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance",
        "Unlimited Pages",
        "Fully Customizable",
        "User Friendly",
        "Mobile Optimized",
        "Admin Panel Integration",
        "SEO Optimized"
      ]
    },
    {
      id: 7,
      title: "Ecommerce Website",
      type: "Dynamic Websites",
      price: 89999,
      originalPrice: 160000,
      discount: 44,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance",
        "Unlimited Products",
        "Fully Customizable",
        "SEO Optimized",
        "Admin Panel Integration",
        "User Friendly",
        "Live Chat"
      ]
    },
    {
      id: 8,
      title: "Food Ordering Website",
      type: "Dynamic Websites",
      price: 59999,
      originalPrice: 100000,
      discount: 40,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance",
        "Unlimited Pages",
        "Mobile Optimized",
        "User Friendly",
        "Food Management"
      ]
    },
    {
      id: 9,
      title: "Appointment Booking Website",
      type: "Dynamic Websites",
      price: 59999,
      originalPrice: 120000,
      discount: 50,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance",
        "Appointment Booking",
        "Fully Customizable",
        "SEO Optimized",
        "Unlimited Pages"
      ]
    },
    {
      id: 10,
      title: "ABC Website",
      type: "Dynamic Websites",
      price: 8999,
      originalPrice: 20000,
      discount: 55,
      features: [
        "Premium Theme",
        "Free Content Updates",
        "Free Maintenance"
      ]
    }
  ]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-md mr-3">
              <span className="font-bold text-xl">M</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">MeraSoftware</h2>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md font-medium hover:bg-blue-200 transition-colors">Login</button>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search for services..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <svg className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Our Website Solutions</h3>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">All</button>
            <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-50">Standard</button>
            <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-50">Dynamic</button>
          </div>
        </div>
        
        {/* Updated grid to show 2 cards per row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {websites.map(website => (
            <ProductCard key={website.id} website={website} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteGrid;