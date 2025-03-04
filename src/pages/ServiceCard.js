import React from 'react';
import { RefreshCw, Clock, ChevronRight, Check, ExternalLink, FileText } from 'lucide-react';

const NeomorphicCards = () => {
  // Subscription card data
  const subscriptionData = {
    planName: "Two Updates",
    purchaseDate: "Purchased: 3 Mar 2025",
    updatesUsed: 1,
    totalUpdates: 2,
    daysLeft: 45,
    isActive: true
  };

  // Project card data
  const projectCardData = {
    status: "Completed",
    projectName: "Restaurant Website",
    completionDate: "Completed: 3 Mar 2025",
    statusItems: [
      "Successfully Deployed",
      "All Features Working"
    ]
  };
  
  // All projects card data
  const allProjectsCardData = {
    title: "View All Projects",
    description: "Browse your complete project history and portfolio.",
    sectionTitle: "All Projects",
    sectionDescription: "View your entire portfolio"
  };
  
  const updatesRemaining = subscriptionData.totalUpdates - subscriptionData.updatesUsed;
  const validityPercentage = (subscriptionData.daysLeft / 60) * 100;
  
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Neomorphic Card Designs</h1>
      
      <div className="flex flex-row gap-4 w-full max-w-6xl overflow-x-auto pb-4">
        {/* Card 1: Subscription Card */}
        <div className="w-64 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          {/* Status indicator pill */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full shadow-sm flex items-center z-10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">Active</span>
          </div>
          
          {/* Main content container */}
          <div className="relative z-10 p-4">
            {/* Plan name and date */}
            <div className="mb-3">
              <h2 className="text-xl font-bold text-gray-800">{subscriptionData.planName}</h2>
              <span className="text-xs text-gray-500">{subscriptionData.purchaseDate}</span>
            </div>
            
            {/* Updates circle indicator */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full shadow-inner bg-white"></div>
                <div className="relative w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <svg viewBox="0 0 100 100" width="90" height="90">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="none" 
                      stroke="#e2e8f0" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={`${(subscriptionData.updatesUsed / subscriptionData.totalUpdates) * 264} 264`}
                      transform="rotate(-90 50 50)"
                    />
                    <g>
                      <text x="50" y="45" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#3b82f6">
                        {updatesRemaining}
                      </text>
                      <text x="50" y="65" textAnchor="middle" fontSize="12" fill="#64748b">
                        updates
                      </text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Validity section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Clock size={12} className="text-gray-400 mr-1" />
                  <span className="text-xs text-gray-600">Validity Period</span>
                </div>
                <span className="text-xs font-medium text-gray-700">{subscriptionData.daysLeft} days</span>
              </div>
              
              {/* Custom progress bar */}
              <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full shadow-sm transform transition-all duration-500 ease-out"
                  style={{ width: `${validityPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div>
              <button className="w-full py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-blue-600 text-sm font-medium mb-2 group">
                <RefreshCw size={14} className="mr-2 group-hover:rotate-45 transition-transform duration-300" />
                <span>Request Update</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Restaurant Website */}
        <div className="w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          <div className="relative z-10 p-4">
            {/* Status label */}
            <div className="mb-1">
              <span className="text-sm font-medium text-emerald-500">{projectCardData.status}</span>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">{projectCardData.projectName}</h2>
              <span className="text-xs text-gray-500">{projectCardData.completionDate}</span>
            </div>
            
            {/* Status items */}
            <div className="mb-4">
              {projectCardData.statusItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center mr-2">
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div>
              <button className="w-full py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-emerald-600 text-sm font-medium mb-2 group">
                <span>View Project</span>
                <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Card 3: View All Projects */}
        <div className="w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          <div className="relative z-10 p-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">{allProjectsCardData.title}</h2>
              <span className="text-xs text-gray-500">{allProjectsCardData.description}</span>
            </div>
            
            {/* Project section */}
            <div className="mb-4">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg shadow-inner flex items-center justify-center mr-2">
                    <ExternalLink size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-800 font-medium">{allProjectsCardData.sectionTitle}</h3>
                    <p className="text-xs text-gray-500">{allProjectsCardData.sectionDescription}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <button className="w-full py-2 bg-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-sm font-medium group">
                <span>Browse Projects</span>
                <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Fourth Card (Copy of Project Card with different colors) */}
        <div className="w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          <div className="relative z-10 p-4">
            {/* Status label */}
            <div className="mb-1">
              <span className="text-sm font-medium text-blue-500">In Progress</span>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Personal Portfolio</h2>
              <span className="text-xs text-gray-500">Started: 1 Mar 2025</span>
            </div>
            
            {/* Status items */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center mr-2">
                  <Check size={12} className="text-blue-500" />
                </div>
                <span className="text-xs text-gray-700">Design Completed</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center mr-2">
                  <Clock size={12} className="text-blue-500" />
                </div>
                <span className="text-xs text-gray-700">Development (70%)</span>
              </div>
            </div>
            
            <div>
              <button className="w-full py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-blue-600 text-sm font-medium mb-2 group">
                <span>Continue Working</span>
                <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeomorphicCards;