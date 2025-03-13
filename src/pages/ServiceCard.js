import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const RestaurantProjectUI = () => {
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  
  // Sample data
  const timelines = [
    { id: 1, title: 'Website Structure ready', status: 'Completed', date: '11 Mar 2025', messages: ['Structure completed as per requirements', 'All pages created successfully'] },
    { id: 2, title: 'Header created', status: 'Completed', date: '11 Mar 2025', messages: ['Header with logo implemented', 'Navigation menu added'] },
    { id: 3, title: 'Footer implemented', status: 'Completed', date: '10 Mar 2025', messages: ['Footer with contact info added', 'Social media links included'] },
    { id: 4, title: 'Menu page designed', status: 'Completed', date: '9 Mar 2025', messages: ['Food categories implemented', 'Item images added'] },
    { id: 5, title: 'Contact form added', status: 'Completed', date: '8 Mar 2025', messages: ['Form validation implemented', 'Submit functionality working'] },
    { id: 6, title: 'Reservation system', status: 'Completed', date: '7 Mar 2025', messages: ['Calendar widget added', 'Time slot selection implemented'] },
    { id: 7, title: 'Reviews section', status: 'Completed', date: '6 Mar 2025', messages: ['Star rating system added', 'Review submission form working'] },
    { id: 8, title: 'Mobile responsiveness', status: 'Completed', date: '5 Mar 2025', messages: ['All pages now responsive', 'Menu displays properly on mobile'] },
    { id: 9, title: 'Final Testing', status: 'In Progress', date: '11 Mar 2025', messages: ['Testing all functionalities', 'Checking browser compatibility'] },
  ];
  
  // Count tasks by status
  const completedTasks = timelines.filter(t => t.status === 'Completed').length;
  const inProgressTasks = timelines.filter(t => t.status === 'In Progress').length;
  const pendingTasks = timelines.filter(t => t.status === 'Pending').length;
  const totalTasks = timelines.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  // Generic messages for the message box
  const allMessages = [
    { id: 1, text: "Design files uploaded to the repository", timestamp: "11 Mar 2025 11:30 PM" },
    { id: 2, text: "Mobile responsive design implemented", timestamp: "11 Mar 2025 10:45 PM" },
    { id: 3, text: "Menu page updated with new items", timestamp: "11 Mar 2025 09:15 PM" },
    { id: 4, text: "Fixed navigation bar issue on smaller screens", timestamp: "10 Mar 2025 04:30 PM" },
    { id: 5, text: "Added reservation form validation", timestamp: "10 Mar 2025 02:20 PM" },
    { id: 6, text: "Updated footer with correct contact information", timestamp: "9 Mar 2025 11:45 AM" },
    { id: 7, text: "Implemented hero section with slider", timestamp: "8 Mar 2025 03:10 PM" },
  ];
  
  // Get messages to display based on selected timeline or show all if none selected
  const messagesToDisplay = selectedTimeline 
    ? timelines.find(t => t.id === selectedTimeline)?.messages.map((msg, idx) => ({ 
        id: `timeline-${selectedTimeline}-msg-${idx}`, 
        text: msg, 
        timestamp: timelines.find(t => t.id === selectedTimeline)?.date,
        timeline: timelines.find(t => t.id === selectedTimeline)?.title
      }))
    : timelines.flatMap(timeline => 
        timeline.messages.map((msg, idx) => ({
          id: `timeline-${timeline.id}-msg-${idx}`,
          text: msg,
          timestamp: timeline.date,
          timeline: timeline.title
        }))
      );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden">
      {/* Project Title */}
      <div className="px-4 pt-4 pb-3 bg-white shadow rounded-b-2xl">
        <h1 className="text-2xl font-bold">Restaurant Website</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">Type: standard websites</p>
          <p className="text-gray-500">Last Update: 11 Mar 2025 11:31 PM</p>
        </div>
      </div>

      {/* Project Progress Section */}
      <div className="mx-4 my-3 bg-white rounded-xl overflow-hidden shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Project Progress & Timeline</h2>
          <ChevronDown size={20} />
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-24 h-24 mr-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 40 * progressPercentage / 100} ${2 * Math.PI * 40 * (100 - progressPercentage) / 100}`}
                  strokeDashoffset={2 * Math.PI * 40 * 25 / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{progressPercentage}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Completed: {completedTasks} tasks</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>In Progress: {inProgressTasks} task</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                <span>Pending: {pendingTasks} tasks</span>
              </div>
            </div>
          </div>
          
          {/* Timeline - Scrollable */}
          <div className="h-40 overflow-y-auto pr-2">
            {timelines.map(timeline => (
              <div 
                key={timeline.id} 
                className="flex items-start mb-3 cursor-pointer" 
                onClick={() => {
                  const newSelection = timeline.id === selectedTimeline ? null : timeline.id;
                  setSelectedTimeline(newSelection);
                  
                  // Give time for the DOM to update before scrolling
                  setTimeout(() => {
                    const messageContainer = document.getElementById('messageContainer');
                    if (messageContainer) {
                      messageContainer.scrollTop = 0;
                    }
                  }, 50);
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                  timeline.status === 'Completed' ? 'bg-green-500 text-white' : 
                  timeline.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                }`}>
                  {timeline.status === 'Completed' && <span>✓</span>}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{timeline.title}</h3>
                  <p className="text-gray-500">{timeline.status}</p>
                </div>
                <div className="text-right text-gray-500">{timeline.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Box Section - Takes remaining space */}
      <div className="mx-4 flex-1 bg-white rounded-xl overflow-hidden shadow flex flex-col mb-4 min-h-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">
            {selectedTimeline 
              ? `Timeline: ${timelines.find(t => t.id === selectedTimeline)?.title}` 
              : "Notification History"}
          </h2>
          {selectedTimeline && (
            <button 
              onClick={() => setSelectedTimeline(null)}
              className="text-blue-500 text-sm"
            >
              Show All
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 min-h-0" id="messageContainer">
          {messagesToDisplay.map(message => (
            <div key={message.id} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
              <p>{message.text}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{message.timestamp}</p>
                {!selectedTimeline && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{message.timeline}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat button */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-3 px-1 rounded-l-lg shadow-lg cursor-pointer">
        <span className="writing-vertical-lr">Chat</span>
      </div>
    </div>
  );
};

// Add vertical text writing mode
const styles = `
  .writing-vertical-lr {
    writing-mode: vertical-lr;
    text-orientation: mixed;
  }
`;

const App = () => (
  <>
    <style>{styles}</style>
    <RestaurantProjectUI />
  </>
);

export default App;