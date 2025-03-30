import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Bell, AlertCircle, CheckCircle, Clock, ArrowLeft, ChevronRight, List, X } from 'lucide-react';

const WebsiteUpdateTracker = () => {
  const [activeNodeIndex, setActiveNodeIndex] = useState(4); // Current active node
  const timelineRef = useRef(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  
  // Sample data - in a real app this would come from your backend
  const nodes = [
    { id: 1, name: 'Project Initialization', status: 'completed', date: '01 Mar 2025', 
      updates: ['Project kickoff meeting completed', 'Team assigned', 'Initial requirements discussed'] },
    { id: 2, name: 'Requirements Gathering', status: 'completed', date: '05 Mar 2025',
      updates: ['Client interviews completed', 'Requirements document finalized', 'Scope document approved'] },
    { id: 3, name: 'Planning Phase', status: 'completed', date: '10 Mar 2025',
      updates: ['Project timeline created', 'Resource allocation completed', 'Risk assessment conducted'] },
    { id: 4, name: 'Design Phase', status: 'in-progress', date: '15 Mar 2025',
      updates: ['Wireframes created', 'Design review in progress', 'UI components finalized'] },
    { id: 5, name: 'Development - Frontend', status: 'pending', date: 'Upcoming',
      updates: [] },
    { id: 6, name: 'Development - Backend', status: 'pending', date: 'Upcoming',
      updates: [] },
    { id: 7, name: 'Integration', status: 'pending', date: 'Upcoming',
      updates: [] },
    { id: 8, name: 'Testing', status: 'pending', date: 'Upcoming',
      updates: [] },
    { id: 9, name: 'Deployment', status: 'pending', date: 'Upcoming',
      updates: [] },
  ];
  
  // Display only completed nodes, current node, and next upcoming node
  const visibleNodes = [
    ...nodes.filter(node => node.status === 'completed'),
    ...nodes.filter(node => node.status === 'in-progress'),
    nodes.find(node => node.status === 'pending') // Only first pending node
  ].filter(Boolean); // Remove undefined values
  
  // Calculate current progress percentage
  const completedNodes = nodes.filter(node => node.status === 'completed').length;
  const inProgressNodes = nodes.filter(node => node.status === 'in-progress').length;
  const progressPercentage = Math.round((completedNodes + inProgressNodes * 0.5) / nodes.length * 100);
  
  // Flatten all updates for the notifications list
  const allNotifications = nodes.flatMap((node, index) => 
    node.updates.map((update, updateIndex) => ({
      id: `${node.id}-${updateIndex}`,
      nodeId: node.id,
      nodeName: node.name,
      text: update,
      date: node.date,
      isNew: index === activeNodeIndex, // Mark updates from current active node as new
      fullContent: `This is the detailed content for the update "${update}" from the ${node.name} phase. It contains comprehensive information about this particular update, including who made the update, what specific changes were implemented, and any relevant details that stakeholders might need to know. This expanded view provides all the context needed to understand the significance of this update within the overall project timeline.`
    }))
  ).filter(notification => notification.text); // Remove empty updates
  
  // Scroll to center active node and apply snap effect - improved with scrollIntoView
  useEffect(() => {
    if (timelineRef.current) {
      const container = timelineRef.current;
      const activeNodeIndex = visibleNodes.findIndex(node => node.status === 'in-progress');
      
      if (activeNodeIndex >= 0) {
        const activeElement = container.querySelector(`[data-node-id="${visibleNodes[activeNodeIndex].id}"]`);
        
        if (activeElement) {
          // Give DOM time to render and then scroll
          setTimeout(() => {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 300);
        }
      }
    }
  }, [visibleNodes, timelineExpanded]);
  
  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': 
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': 
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': 
        return <AlertCircle className="w-5 h-5 text-gray-300" />;
      default: 
        return <AlertCircle className="w-5 h-5 text-gray-300" />;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
        {/* Header with blue background */}
        <div className="bg-blue-600 p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold text-white">Website Update - Basic Plan</h1>
          <p className="text-blue-100 text-sm mt-1">Type: website updates</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* Circular Progress Meter */}
          <div className="md:col-span-1 flex flex-col items-center justify-start">
            <div className="relative w-40 h-40">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
              
              {/* Progress circle with blue color */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="8"
                  strokeDasharray={`${progressPercentage * 2.89} 1000`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-blue-700">{progressPercentage}%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>
            
            {/* Current Stage */}
            <div className="mt-6 text-center w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Stage</h3>
              <div className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105">
                <button className="w-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="font-medium">Request Update</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Timeline with Snap Scrolling - Desktop Version */}
          <div className="hidden md:flex md:col-span-2 md:flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Progress Timeline</h2>
            <div 
              ref={timelineRef}
              className="relative overflow-y-auto pr-2 rounded-lg bg-gray-50" 
              style={{ 
                height: "320px", 
                scrollSnapType: "y proximity",
                scrollBehavior: "smooth"
              }}
            >
              {/* Timeline nodes with simplified layout */}
              <div className="relative p-4">
                {/* Vertical line running through all nodes */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                
                <div className="space-y-8">
                  {visibleNodes.map((node) => (
                    <div 
                      key={node.id}
                      data-node-id={node.id}
                      className={`relative flex rounded-lg transition-all duration-300 ${
                        node.status === 'in-progress' ? 'bg-blue-50 p-4 shadow-sm border-l-4 border-blue-500' : 
                        node.status === 'completed' ? 'p-4 hover:bg-blue-50' : 'p-4'
                      }`}
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* Node dot */}
                      <div 
                        className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          node.status === 'completed' ? 'border-2 border-green-500 bg-green-50' :
                          node.status === 'in-progress' ? 'border-2 border-blue-500 bg-blue-50 shadow-md' :
                          'border-2 border-gray-300 bg-white'
                        }`}
                        style={{ marginLeft: "0.5px" }}
                      >
                        {node.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : node.status === 'in-progress' ? (
                          <Clock className="w-4 h-4 text-blue-500" />
                        ) : (
                          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                        )}
                      </div>
                      
                      {/* Content - Left side */}
                      <div className="ml-4 flex-1">
                        <h3 className="text-md font-medium text-gray-800">{node.name}</h3>
                        <p className={`text-sm ${
                          node.status === 'completed' ? 'text-green-600' : 
                          node.status === 'in-progress' ? 'text-blue-600' : 
                          'text-gray-600'
                        }`}>
                          {node.status === 'completed' ? 'Completed' : 
                           node.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                        </p>
                      </div>
                      
                      {/* Right side - date */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">{node.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Timeline Section - Collapsed by default */}
          <div className="md:hidden w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Progress Timeline</h2>
              <button 
                onClick={() => setTimelineExpanded(!timelineExpanded)}
                className="flex items-center justify-center bg-blue-50 text-blue-500 p-2 rounded-md transition-colors hover:bg-blue-100"
              >
                {timelineExpanded ? (
                  <><X className="w-4 h-4 mr-1" /> Close</>
                ) : (
                  <><List className="w-4 h-4 mr-1" /> View</>
                )}
              </button>
            </div>
            
            {/* Current progress summary for mobile - always visible */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100 shadow-sm">
              <div className="flex items-center">
                {getStatusIcon('in-progress')}
                <div className="ml-3">
                  <p className="font-medium text-blue-800">
                    {nodes.find(node => node.status === 'in-progress')?.name || 'Not Started'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {completedNodes} of {nodes.length} phases completed ({progressPercentage}%)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Expanded timeline for mobile */}
            {timelineExpanded && (
              <div 
                ref={timelineRef}
                className="bg-white border border-gray-200 rounded-lg p-4 mb-4 relative overflow-y-auto shadow-md" 
                style={{ 
                  maxHeight: "300px",
                  scrollSnapType: "y proximity",
                  scrollBehavior: "smooth"
                }}
              >
                {/* Timeline with simplified layout for mobile */}
                <div className="relative">
                  {/* Vertical line running from top to active node */}
                  <div className="absolute left-4 top-0 bg-blue-500 w-0.5" 
                       style={{ 
                         height: `${visibleNodes.findIndex(node => node.status === 'in-progress') * 88 + 88}px`
                       }}></div>
                  
                  <div className="space-y-8">
                    {visibleNodes.map((node) => (
                      <div 
                        key={node.id}
                        data-node-id={node.id}
                        className={`relative flex rounded-lg transition-all duration-300 ${
                          node.status === 'in-progress' ? 'bg-blue-50 p-4 border-l-4 border-blue-500' : 
                          node.status === 'completed' ? 'p-4 hover:bg-blue-50' : 'p-4'
                        }`}
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        {/* Node dot */}
                        <div 
                          className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            node.status === 'completed' ? 'border-2 border-green-500 bg-green-50' :
                            node.status === 'in-progress' ? 'border-2 border-blue-500 bg-blue-50 shadow-md' :
                            'border-2 border-gray-300 bg-white'
                          }`}
                          style={{ marginLeft: "0.5px" }}
                        >
                          {node.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : node.status === 'in-progress' ? (
                            <Clock className="w-4 h-4 text-blue-500" />
                          ) : (
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                          )}
                        </div>
                        
                        {/* Content - Left side with status directly underneath title */}
                        <div className="ml-4 flex-1">
                          <h3 className="text-md font-medium text-gray-800">{node.name}</h3>
                          <div className="flex flex-col">
                            <span className={`text-sm ${
                              node.status === 'completed' ? 'text-green-600' : 
                              node.status === 'in-progress' ? 'text-blue-600' : 
                              'text-gray-600'
                            }`} style={{ lineHeight: '1.2' }}>
                              {node.status === 'completed' ? 'Completed' : 
                               node.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Right side - date */}
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">{node.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {!expandedNotification ? (
            // Collapsed notification view (list of updates)
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-700">Recent Updates</h2>
                </div>
                {allNotifications.length > 3 && (
                  <button 
                    className="text-blue-500 text-sm font-medium flex items-center hover:text-blue-700 transition-colors"
                    onClick={() => setShowAllNotifications(!showAllNotifications)}
                  >
                    {showAllNotifications ? (
                      <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></>
                    ) : (
                      <>View All <ChevronDown className="ml-1 w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
              
              {allNotifications.length > 0 ? (
                <div className="space-y-3">
                  {(showAllNotifications ? allNotifications : allNotifications.slice(0, 3)).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-md transform hover:translate-x-1 ${
                        notification.isNew ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'
                      }`}
                      onClick={() => setExpandedNotification(notification)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-800">
                          {notification.nodeName}
                          {notification.isNew && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">New</span>
                          )}
                        </h4>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{notification.date}</span>
                          <ChevronRight className="w-4 h-4 text-blue-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{notification.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6 bg-white rounded-lg border border-gray-200">No updates yet</p>
              )}
            </>
          ) : (
            // Expanded notification view (email-like)
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center border-b border-gray-200 p-4 mb-4">
                <button 
                  onClick={() => setExpandedNotification(null)}
                  className="mr-3 hover:bg-blue-50 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-blue-500" />
                </button>
                <h2 className="text-lg font-semibold text-gray-700">Notification Details</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-blue-800">{expandedNotification.nodeName}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Date: {expandedNotification.date}</span>
                    {expandedNotification.isNew && (
                      <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">New</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-blue-700 mb-2">Summary</h4>
                  <p className="text-gray-800">{expandedNotification.text}</p>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Details</h4>
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">{expandedNotification.fullContent}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteUpdateTracker;