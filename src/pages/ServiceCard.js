import React from 'react';

const ReversedCards = () => {
  const websites = [
    {
      title: "COLLEGE WEBSITE",
      name: "College Website",
      features: ["Premium Theme", "Free Content Updates", "+ 3 more"]
    },
    {
      title: "EDUCATIONAL WEBSITE",
      name: "Educational Website",
      features: ["Premium Theme", "Free Content Updates", "+ 1 more"]
    },
    {
      title: "LOCAL SERVICE WEBISTE",
      name: "Local Service Webiste",
      features: ["Premium Theme", "Free Content Updates", "+ 2 more"]
    },
    {
      title: "PORTFOLIO WEBSITE",
      name: "Portfolio Website",
      features: ["Premium Theme", "Free Content Updates", "+ 1 more"]
    },
    {
      title: "RESTAURANT WEBSITE",
      name: "Restaurant Website",
      features: ["Premium Theme", "Free Content Updates", "+ 3 more"]
    }
  ];

  return (
    <div className="bg-gray-100 p-4 w-full">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold">Standard Websites</h1>
        <a href="#" className="text-blue-500">View All</a>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 px-4 pb-8">
          {websites.map((website, index) => (
            <div key={index} className="min-w-[280px] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              {/* Header - Reversed from blue to white */}
              <div className="px-4 py-2 bg-white text-blue-500 font-bold">
                {website.title}
              </div>
              
              {/* Image Area */}
              <div className="h-32 bg-gray-200 relative overflow-hidden">
                {website.title.includes("COLLEGE") || website.title.includes("EDUCATIONAL") ? (
                  <div className="absolute inset-0 bg-blue-900 flex flex-col items-start justify-center px-6">
                    <div className="text-white text-xs mb-1">World Leading University</div>
                    <div className="text-white font-bold text-lg mb-4">Educavo University</div>
                    <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-sm">Learn more</div>
                  </div>
                ) : website.title.includes("LOCAL") ? (
                  <div className="absolute inset-0 bg-blue-400 flex flex-col items-center justify-center px-6">
                    <div className="text-white font-bold text-2xl">Go Travel</div>
                  </div>
                ) : website.title.includes("PORTFOLIO") ? (
                  <div className="absolute inset-0 bg-gray-700 flex flex-col items-center justify-center px-6">
                    <div className="text-white font-bold text-lg">Tampere Ahaa Libaklind</div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center px-6">
                    <div className="text-white font-bold text-lg">Restaurant</div>
                  </div>
                )}
              </div>
              
              {/* Content Area - Reversed from white to blue */}
              <div className="p-4 bg-blue-700 text-white">
                <h3 className="text-lg font-medium mb-3">{website.name}</h3>
                
                <ul className="mb-4">
                  {website.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start mb-2">
                      <span className="text-red-500 mr-2 font-bold">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Button - Reversed from blue to white */}
                <button className="w-full py-2 bg-white text-blue-500 rounded font-medium text-center">
                  Customize Plan
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          ‹
        </button>
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          ›
        </button>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-2">
        <span className="h-2 w-2 rounded-full bg-blue-500 mx-1"></span>
        <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
      </div>
    </div>
  );
};

export default ReversedCards;