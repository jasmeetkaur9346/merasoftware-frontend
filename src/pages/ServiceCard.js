import React from 'react';

const ProjectDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded flex items-center justify-center text-xl font-bold mr-2">
              M
            </div>
            <span className="font-bold text-lg">MeraSoftware</span>
          </div>
          
          <div className="flex items-center">
            <div className="relative mx-4 w-64">
              <input 
                type="text" 
                placeholder="Search for services..." 
                className="w-full py-2 px-4 rounded-lg border border-gray-300"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="mx-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg">
              Login
            </button>
          </div>
        </div>
        
        {/* Navigation links */}
        <div className="flex mb-8">
          <button className="font-medium mr-6">All Services</button>
          <button className="font-medium mr-6">Websites Development</button>
          <button className="font-medium mr-6">Mobile Apps</button>
          <button className="font-medium mr-6">Cloud Softwares</button>
          <button className="font-medium">Feature Upgrades</button>
        </div>
      </div>
      
      {/* Welcome back and Explore More section - redesigned */}
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Welcome back card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 flex-1 shadow-sm border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Welcome back</p>
                <h1 className="text-2xl font-bold text-gray-800">Let's see your projects</h1>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600">Review your ongoing projects and track their progress</p>
            </div>
          </div>
          
          {/* Explore More card */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 flex-1 shadow-sm border border-purple-200 cursor-pointer group hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-600 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-purple-700 font-medium group-hover:text-purple-800 transition-all">Discover more</p>
                <h2 className="text-2xl font-bold text-gray-800">Explore Our Services</h2>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-purple-200 transition-all">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600">Find exciting features and premium plans tailored for you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Projects heading */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h2>
      
      {/* Project cards grid - keeping the existing boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* In Progress - Restaurant Website */}
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-yellow-500">
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-sm text-yellow-600">In Progress</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">Restaurant Website</h3>
          <p className="text-sm text-gray-500 mb-3">Started: 22 Mar 2025</p>
          
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Development in progress</span>
          </div>
          
          <div className="mb-3">
            <p className="text-sm mb-1">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
            <span className="text-xs text-right block mt-1">0%</span>
          </div>
          
          <button className="w-full py-2 text-center text-yellow-600 border border-yellow-500 rounded-md hover:bg-yellow-50 transition">
            View Project
          </button>
        </div>
        
        {/* Completed - Website Update */}
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-500">
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-600">Completed</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">Website Update - Basic Plan</h3>
          <p className="text-sm text-gray-500 mb-3">Ended: 17 Mar 2025</p>
          
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Updates Used: 4 of 4</span>
          </div>
          
          <div className="flex items-center mb-3">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Plan Completed</span>
          </div>
          
          <button className="w-full py-2 text-center text-white bg-green-500 rounded-md hover:bg-green-600 transition">
            View Details
          </button>
        </div>
        
        {/* Completed - Appointment Booking Website */}
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-500">
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-600">Completed</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">Appointment Booking Website</h3>
          <p className="text-sm text-gray-500 mb-3">Completed: 16 Mar 2025</p>
          
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Successfully Deployed</span>
          </div>
          
          <div className="flex items-center mb-3">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">All Features Working</span>
          </div>
          
          <button className="w-full py-2 text-center text-white bg-green-500 rounded-md hover:bg-green-600 transition">
            View Project
          </button>
        </div>
        
        {/* History - View All Projects */}
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-purple-500">
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-sm text-purple-600">History</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">View All Projects</h3>
          <p className="text-sm text-gray-500 mb-10">Browse your complete project history and portfolio.</p>
          
          <div className="bg-purple-100 rounded-lg p-3 mb-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-200 rounded flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">All Projects</p>
                <p className="text-xs text-gray-500">View your entire portfolio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;