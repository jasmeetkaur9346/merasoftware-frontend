import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const ProjectDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // First fetch order data
      const orderResponse = await fetch(`${SummaryApi.orderDetails.url}/${orderId}`, {
        credentials: 'include',
      });
      const orderData = await orderResponse.json();
      
      if (orderData.success) {
        const order = orderData.data;
        
        // If there's an assigned developer ID but it's not already populated (it's just an ID string)
        if (order.assignedDeveloper && typeof order.assignedDeveloper === 'string') {
          try {
            // Use your new endpoint to fetch developer details by ID
            const devResponse = await fetch(`${SummaryApi.getSingleDeveloper.url}/${order.assignedDeveloper}`, {
              credentials: 'include',
            });
            const devData = await devResponse.json();
            
            if (devData.success) {
              // Combine the data
              order.assignedDeveloper = devData.data;
            }
          } catch (devError) {
            console.error("Error fetching developer:", devError);
          }
        }
        
        setOrder(order);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading || !order) return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="rounded-lg p-8">
        <TriangleMazeLoader />
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto bg-gray-50 min-h-screen p-4">
      {/* Project Header Card */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <h1 className="text-xl font-bold">{order.productId?.serviceName}</h1>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Type:</span>
            <span>{order.productId?.category?.split('_').join(' ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Start Date: {formatDate(order.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last Update: {formatDate(order.lastUpdated)} {formatTime(order.lastUpdated)}
          </div>
        </div>
      </div>

      {/* Developer Card and Progress Card (Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Developer Card - Conditionally display developer info or default view */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
                {order.assignedDeveloper && order.assignedDeveloper.avatar ? (
                  <img 
                    src={order.assignedDeveloper.avatar} 
                    alt={order.assignedDeveloper.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-2xl">👤</div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            {order.assignedDeveloper && typeof order.assignedDeveloper === 'object' ? (
              <>
                <h2 className="font-bold text-lg mt-1">{order.assignedDeveloper.name}</h2>
                <p className="text-sm text-gray-600">{order.assignedDeveloper.designation}</p>
                
                <div className="flex space-x-2 mt-4">
                  <a 
                    href={`tel:${order.assignedDeveloper.phone}`} 
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                  <a 
                    href={`mailto:${order.assignedDeveloper.email}`} 
                    className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-bold text-lg mt-1">Not Assigned</h2>
                <p className="text-sm text-gray-600">Developer Not Yet Assigned</p>
                
                <div className="flex space-x-2 mt-4">
                  <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center cursor-not-allowed opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center cursor-not-allowed opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
          
        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - order.projectProgress / 100)}`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-xl font-bold">{order.projectProgress}%</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowTimeline(true)}
              className="mt-4 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              View Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold text-lg mb-4">Recent Updates</h2>
        <div className="space-y-4">
          {order.messages?.map((msg, index) => (
            <div 
              key={index} 
              className={`relative pl-4 border-l-4 ${index === 0 ? 'border-yellow-500' : 'border-blue-500'}`}
            >
              <h3 className="font-semibold text-base">{msg.title || 'Project Update'}</h3>
              <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp)}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {msg.checkpoint || (index === 0 ? 'Setup Phase' : 'Planning Phase')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimeline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-h-[80vh] overflow-y-auto w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Project Timeline</h3>
              <button 
                onClick={() => setShowTimeline(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {order.checkpoints?.map((checkpoint, index) => (
                <div key={checkpoint.checkpointId} className="relative">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      checkpoint.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="ml-3">
                      <h3 className="font-medium">{checkpoint.name}</h3>
                      <div className="text-sm text-gray-500">
                        {checkpoint.completed ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                  {index < order.checkpoints.length - 1 && (
                    <div className="absolute left-2 ml-[-1px] w-0.5 h-8 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;