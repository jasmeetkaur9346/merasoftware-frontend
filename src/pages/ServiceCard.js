import React, { useState } from 'react';

// Original Card Variant (with improvements)
const OriginalCard = ({ website }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const hasMoreFeatures = website.features.length > 5;
  const displayFeatures = showAllFeatures ? website.features : website.features.slice(0, 5);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-200">
      {/* Card Header */}
      <div className="bg-blue-50 p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{website.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{website.type}</p>
      </div>
      
      {/* Features Section */}
      <div className="p-4 flex-grow">
        <div className="mb-2 pb-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Package Includes:</p>
        </div>
        <ul className="text-sm space-y-2 mb-4">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">{feature}</span>
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
      
      {/* Price Section */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg px-3 py-2 inline-flex items-center">
              <span className="text-xl font-bold text-blue-800">₹{website.price.toLocaleString()}</span>
            </div>
            {website.originalPrice && (
              <div className="ml-3">
                <span className="text-base text-gray-500 line-through">
                  ₹{website.originalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          {website.discount && (
            <div className="bg-teal-100 px-2 py-1 rounded">
              <span className="font-medium text-teal-700">
                {website.discount}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Button Section */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 hidden sm:block">
        <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          View Details
        </button>
      </div>
    </div>
  );
};

// Variant 2: Modern Minimal Card
const MinimalCard = ({ website }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const hasMoreFeatures = website.features.length > 5;
  const displayFeatures = showAllFeatures ? website.features : website.features.slice(0, 5);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Top Discount Badge */}
      {website.discount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {website.discount}% OFF
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{website.title}</h3>
        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">{website.type}</p>
        
        {/* Price Section */}
        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold text-gray-900">₹{website.price.toLocaleString()}</span>
          {website.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{website.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gray-100 w-full my-4"></div>
        
        {/* Features */}
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Features</p>
        <ul className="text-sm space-y-2 mb-4">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Show More button */}
        {hasMoreFeatures && (
          <button 
            onClick={() => setShowAllFeatures(!showAllFeatures)} 
            className="text-gray-500 text-xs uppercase tracking-wider hover:text-gray-800 transition-colors"
          >
            {showAllFeatures ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      
      {/* Button */}
      <div className="mt-auto p-5 pt-0">
        <button className="w-full py-2.5 bg-gray-900 text-white font-medium text-sm rounded-lg transition-colors duration-300 hover:bg-black focus:outline-none hidden sm:block">
          Select Package
        </button>
      </div>
    </div>
  );
};

// Variant 3: Colorful Card with Gradient
const GradientCard = ({ website }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const hasMoreFeatures = website.features.length > 5;
  const displayFeatures = showAllFeatures ? website.features : website.features.slice(0, 5);
  
  // Different gradient backgrounds based on website type
  const gradientClass = website.type.includes("Dynamic") 
    ? "bg-gradient-to-br from-purple-500 to-indigo-600" 
    : "bg-gradient-to-br from-blue-500 to-teal-400";

  return (
    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-200">
      {/* Card Header with Gradient */}
      <div className={`${gradientClass} p-5 text-white`}>
        <h3 className="text-xl font-bold">{website.title}</h3>
        <p className="text-sm text-white text-opacity-80 mt-1">{website.type}</p>
        
        {/* Price Section on gradient */}
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-extrabold">₹{website.price.toLocaleString()}</span>
          {website.originalPrice && (
            <span className="ml-2 text-sm text-white text-opacity-80 line-through">
              ₹{website.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Discount Tag */}
        {website.discount && (
          <div className="mt-2 inline-block bg-white bg-opacity-25 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-xs font-semibold">SAVE {website.discount}%</span>
          </div>
        )}
      </div>
      
      {/* Features Section with White Background */}
      <div className="p-5 bg-white flex-grow">
        <p className="text-sm font-medium text-gray-900 mb-3">What's Included:</p>
        <ul className="text-sm space-y-2.5 mb-4">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Show More button */}
        {hasMoreFeatures && (
          <button 
            onClick={() => setShowAllFeatures(!showAllFeatures)} 
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
          >
            {showAllFeatures ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      
      {/* Button Section */}
      <div className="p-5 pt-0 bg-white hidden sm:block">
        <button className={`w-full py-2.5 ${gradientClass} text-white font-medium rounded-lg transition-opacity duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
          Get Started
        </button>
      </div>
    </div>
  );
};

// Variant 4: Horizontal Card (for larger screens)
const HorizontalCard = ({ website }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const hasMoreFeatures = website.features.length > 5;
  const displayFeatures = showAllFeatures ? website.features : website.features.slice(0, 5);

  // This card is only for larger screens, on mobile it reverts to vertical
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row h-full">
      {/* Left Section */}
      <div className="p-5 sm:w-2/5 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{website.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{website.type}</p>
        
        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">₹{website.price.toLocaleString()}</span>
            {website.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{website.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {website.discount && (
            <div className="mt-1">
              <span className="text-sm font-medium text-green-600">
                Save {website.discount}% today
              </span>
            </div>
          )}
        </div>
        
        {/* Button - visible on all screen sizes for horizontal card */}
        <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Choose Plan
        </button>
      </div>
      
      {/* Right Section */}
      <div className="p-5 border-t sm:border-t-0 sm:border-l border-gray-200 sm:w-3/5">
        <p className="text-sm font-medium text-gray-700 mb-3">Package Features:</p>
        <ul className="text-sm space-y-2 mb-4">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Show More button */}
        {hasMoreFeatures && (
          <button 
            onClick={() => setShowAllFeatures(!showAllFeatures)} 
            className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          >
            {showAllFeatures ? "Show Less" : "Show More Features"}
          </button>
        )}
      </div>
    </div>
  );
};

// Variant 5: Dark Mode Card
const DarkCard = ({ website }) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const hasMoreFeatures = website.features.length > 5;
  const displayFeatures = showAllFeatures ? website.features : website.features.slice(0, 5);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-800">
      {/* Card Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">{website.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{website.type}</p>
      </div>
      
      {/* Features Section */}
      <div className="p-4 flex-grow">
        <div className="mb-2 pb-2 border-b border-gray-800">
          <p className="text-sm font-medium text-gray-300">Package Includes:</p>
        </div>
        <ul className="text-sm space-y-2 mb-4">
          {displayFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-teal-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Show More button */}
        {hasMoreFeatures && (
          <button 
            onClick={() => setShowAllFeatures(!showAllFeatures)} 
            className="text-teal-400 text-sm font-medium hover:text-teal-300 transition-colors"
          >
            {showAllFeatures ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      
      {/* Price Section */}
      <div className="px-4 pb-4 border-t border-gray-800 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-800 rounded-lg px-3 py-2 inline-flex items-center">
              <span className="text-xl font-bold text-white">₹{website.price.toLocaleString()}</span>
            </div>
            {website.originalPrice && (
              <div className="ml-3">
                <span className="text-base text-gray-500 line-through">
                  ₹{website.originalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          {website.discount && (
            <div className="bg-teal-900 px-2 py-1 rounded">
              <span className="font-medium text-teal-400">
                {website.discount}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Button Section */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 hidden sm:block">
        <button className="w-full py-2 px-4 bg-teal-500 text-white font-medium rounded-md transition-colors duration-300 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
          View Details
        </button>
      </div>
    </div>
  );
};

// Main Component to showcase all variants
const ProductCardVariants = () => {
  // Sample data
  const sampleWebsite = {
    id: 1,
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
  };

  const standardWebsite = {
    id: 2,
    title: "Personal Brand Website",
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
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Product Card Variants</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Original Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <OriginalCard website={sampleWebsite} />
          <OriginalCard website={standardWebsite} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Minimal Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <MinimalCard website={sampleWebsite} />
          <MinimalCard website={standardWebsite} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Gradient Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <GradientCard website={sampleWebsite} />
          <GradientCard website={standardWebsite} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Horizontal Style (reverts to vertical on mobile)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <HorizontalCard website={sampleWebsite} />
          <HorizontalCard website={standardWebsite} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Dark Mode Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <DarkCard website={sampleWebsite} />
          <DarkCard website={standardWebsite} />
        </div>
      </div>
    </div>
  );
};

export default ProductCardVariants;