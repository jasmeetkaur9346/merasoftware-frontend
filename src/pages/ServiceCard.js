import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Bell, AlertCircle, CheckCircle, Clock, ArrowLeft, ChevronRight } from 'lucide-react';

const WebsiteUpdateTracker = () => {
  const [activeNodeIndex, setActiveNodeIndex] = useState(4); // Current active node
  const timelineRef = useRef(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(null);
  
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
  
  // Scroll to center active node and apply snap effect
  useEffect(() => {
    if (timelineRef.current) {
      const container = timelineRef.current;
      const activeNodeIndex = visibleNodes.findIndex(node => node.status === 'in-progress');
      
      if (activeNodeIndex >= 0) {
        const activeElement = container.querySelector(`[data-node-id="${visibleNodes[activeNodeIndex].id}"]`);
        
        if (activeElement) {
          container.scrollTo({
            top: activeElement.offsetTop - container.offsetHeight / 2 + activeElement.offsetHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, []);
  
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
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Website Update - Basic Plan</h1>
          <p className="text-sm text-gray-500">Type: website updates</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Circular Progress Meter */}
          <div className="md:col-span-1 flex flex-col items-center justify-start">
            <div className="relative w-36 h-36">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              
              {/* Progress circle */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${progressPercentage * 2.89} 1000`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{progressPercentage}%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>
            
            {/* Current Stage */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-700">Current Stage</h3>
              <div className="mt-2 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center">
                  {getStatusIcon('in-progress')}
                  <span className="ml-2 font-medium text-gray-800">
                    {nodes.find(node => node.status === 'in-progress')?.name || 'Not Started'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Started on {nodes.find(node => node.status === 'in-progress')?.date || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Timeline with Snap Scrolling */}
          <div className="md:col-span-2 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Progress Timeline</h2>
            <div 
              ref={timelineRef}
              className="relative overflow-y-auto pr-2 snap-y snap-mandatory" 
              style={{ height: "320px", scrollSnapType: "y mandatory" }}
            >
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Timeline nodes with snap points */}
              <div className="space-y-6 ml-2">
                {visibleNodes.map((node) => (
                  <div 
                    key={node.id}
                    data-node-id={node.id}
                    className={`relative flex snap-start snap-always ${
                      node.status === 'in-progress' ? 'bg-blue-50 p-2 rounded-lg -ml-2' : ''
                    }`}
                    style={{ scrollSnapAlign: "center", minHeight: "80px" }}
                  >
                    {/* Node dot */}
                    <div 
                      className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        node.status === 'completed' ? 'bg-green-100 border-green-500' :
                        node.status === 'in-progress' ? 'bg-blue-100 border-blue-500' :
                        'bg-white border-gray-300'
                      }`}
                    >
                      {node.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : node.status === 'in-progress' ? (
                        <Clock className="w-4 h-4 text-blue-500" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-md font-medium text-gray-800">{node.name}</h3>
                        <span className="text-sm text-gray-500">{node.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {node.status === 'completed' ? 'Completed' : 
                         node.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                      </p>
                      
                      {/* Show update count instead of all updates */}
                      {node.updates.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-blue-500">{node.updates.length} updates</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="border-t border-gray-200 p-6">
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
                    className="text-blue-500 text-sm font-medium flex items-center"
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
                      className={`p-3 rounded-md border cursor-pointer hover:border-blue-300 transition-colors ${
                        notification.isNew ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setExpandedNotification(notification)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-800">
                          {notification.nodeName}
                          {notification.isNew && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">New</span>
                          )}
                        </h4>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{notification.date}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No updates yet</p>
              )}
            </>
          ) : (
            // Expanded notification view (email-like)
            <div className="bg-white">
              <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                <button 
                  onClick={() => setExpandedNotification(null)}
                  className="mr-3 hover:bg-gray-100 p-1 rounded"
                >
                  <ArrowLeft className="w-5 h-5 text-blue-500" />
                </button>
                <h2 className="text-lg font-semibold text-gray-700">Notification Details</h2>
              </div>
              
              <div>
                <div className="mb-4 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">{expandedNotification.nodeName}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Date: {expandedNotification.date}</span>
                    {expandedNotification.isNew && (
                      <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">New</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Summary</h4>
                  <p className="text-gray-800">{expandedNotification.text}</p>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Details</h4>
                  <p className="text-gray-600 whitespace-pre-line">{expandedNotification.fullContent}</p>
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