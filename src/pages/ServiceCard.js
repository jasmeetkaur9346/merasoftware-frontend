import React from 'react';
import { RefreshCw, Clock, ChevronRight, Check, ExternalLink, FileText } from 'lucide-react';

const ImprovedNeomorphicCards = () => {
  // Subscription card data
  const subscriptionData = {
    planName: "Two Updates",
    purchaseDate: "Purchased: 3 Mar 2025",
    updatesUsed: 1,
    totalUpdates: 2,
    daysLeft: 45,
    daysTotal: 60,
    isActive: true
  };

  // Project card data
  const projectCardData = {
    status: "Completed",
    projectName: "Restaurant Website",
    completionDate: "Completed: 3 Mar 2025",
    statusItems: [
      "Successfully Deployed"
    ]
  };
  
  // All projects card data
  const allProjectsCardData = {
    title: "View All Projects",
    description: "Browse your project history",
    sectionTitle: "All Projects",
    sectionDescription: "View your entire portfolio"
  };
  
  // In progress card data
  const inProgressCardData = {
    status: "In Progress",
    projectName: "Personal Portfolio",
    progress: 70,
    statusItems: [
      "Design Completed"
    ]
  };
  
  const updatesRemaining = subscriptionData.totalUpdates - subscriptionData.updatesUsed;
  const daysLeftPercentage = (subscriptionData.daysLeft / subscriptionData.daysTotal) * 100;
  
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Neomorphic Card Designs</h1>
      
      <div className="flex flex-row gap-4 w-full max-w-6xl overflow-x-auto pb-4">
        {/* Card 1: Subscription Card */}
        <div className="w-64 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
          {/* Card background with highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          {/* Main content container */}
          <div className="relative z-10 p-4">
            {/* Status indicator pill - Now inside main content */}
            <div className="flex justify-end mb-1">
              <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">Active</span>
              </div>
            </div>
            
            {/* Plan name and updates indicator side by side */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold text-gray-800">{subscriptionData.planName}</h2>
                <span className="text-xs text-gray-500">{subscriptionData.purchaseDate}</span>
              </div>
              
              {/* Updates circle indicator (now on right) */}
              <div className="relative w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                <svg viewBox="0 0 100 100" width="64" height="64">
                  {/* Background ring */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="8"
                  />
                  
                  {/* Progress arc */}
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
                  
                  {/* Inner text */}
                  <text x="50" y="45" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#3b82f6">
                    {updatesRemaining}
                  </text>
                  <text x="50" y="65" textAnchor="middle" fontSize="10" fill="#64748b">
                    left
                  </text>
                </svg>
              </div>
            </div>
            
            {/* Days left bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Clock size={12} className="text-gray-400 mr-1" />
                  <span className="text-xs text-gray-600">Days Left</span>
                </div>
                <span className="text-xs font-medium text-gray-700">{subscriptionData.daysLeft}</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                  style={{ width: `${daysLeftPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Action button */}
            <button className="w-full py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-blue-600 text-sm font-medium group">
              <span>View Details</span>
              <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Card 2: Completed Project */}
        <div className="flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
          {/* Card background with highlight effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          {/* Main content container */}
          <div className="relative z-10 p-4">
            {/* Status label */}
            <p className="text-sm font-medium text-emerald-500 mb-1">{projectCardData.status}</p>
            
            {/* Project name */}
            <h2 className="text-lg font-bold text-gray-800 mb-1">{projectCardData.projectName}</h2>
            <span className="text-xs text-gray-500 block mb-3">{projectCardData.completionDate}</span>
            
            {/* Status items */}
            <div className="mb-4">
              {projectCardData.statusItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            {/* Action button */}
            <button className="w-full py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-emerald-600 text-sm font-medium group">
              <span>View Project</span>
              <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>
        
        {/* Card 3: View All Projects */}
        <div className="flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
          {/* Card background with highlight effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          {/* Main content container */}
          <div className="relative z-10 p-4">
            {/* Title and description */}
            <h2 className="text-lg font-bold text-gray-800 mb-1">{allProjectsCardData.title}</h2>
            <p className="text-xs text-gray-500 mb-4">{allProjectsCardData.description}</p>
            
            {/* Project section */}
            <div className="mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
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
            
            {/* Action button */}
            <button className="w-full py-2 bg-purple-600 text-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-sm font-medium group">
              <span>Browse All</span>
              <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Card 4: In Progress Card */}
        <div className="w-64 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
          {/* Card background with highlight effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-80"></div>
          
          {/* Main content container */}
          <div className="relative z-10 p-4">
            {/* Status label */}
            <p className="text-sm font-medium text-amber-500 mb-1">{inProgressCardData.status}</p>
            
            {/* Project name */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">{inProgressCardData.projectName}</h2>
            
            {/* Status items */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-amber-500" />
                </div>
                <span className="text-sm text-gray-700">{inProgressCardData.statusItems[0]}</span>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Development</span>
                  <span className="font-medium">{inProgressCardData.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    style={{ width: `${inProgressCardData.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Action button */}
            <button className="w-full py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-amber-600 text-sm font-medium group">
              <span>Continue</span>
              <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedNeomorphicCards;