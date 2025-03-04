import React, { useState } from 'react';
import { Search, CheckCircle, MessageSquare, PlusCircle, Home, ShoppingBag, 
  UserCircle, Wallet, ChevronRight, ExternalLink, Bell, ChevronDown, Settings } from 'lucide-react';

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md mr-2">
              M
            </div>
            <span className="font-bold text-lg">MeraSoftware</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
              <Wallet size={16} className="text-blue-600 mr-1" />
              <span className="text-sm font-medium">₹23K</span>
            </div>
            
            <div className="relative">
              <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
              </button>
            </div>
            
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img src="/api/placeholder/32/32" alt="Profile" />
            </div>
          </div>
        </div>
        
        {/* Search Bar - Below top nav */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search projects, orders..."
            className="w-full py-2 px-4 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <Search size={16} />
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 overflow-auto">
        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-1">Welcome back,</div>
          <h2 className="text-lg font-bold text-gray-800">Sandeep Singh</h2>
        </div>
        
        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Your Projects</h3>
            <div className="flex space-x-1">
              <button className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-600">
                Filter
              </button>
              <button className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-600">
                Sort
              </button>
            </div>
          </div>
          
          {/* Project Cards - Square cards in a 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Start a New Project */}
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-sm overflow-hidden text-white aspect-square flex flex-col items-center justify-center text-center p-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <PlusCircle size={20} />
              </div>
              <h4 className="font-bold text-sm mb-1">Start a New Project</h4>
              <p className="text-blue-100 text-xs mb-2">Begin your next success</p>
              <button className="w-full py-1.5 bg-white text-blue-600 rounded-lg text-xs font-medium shadow-sm">
                Create
              </button>
            </div>
            
            {/* Card 2: Completed Project */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 aspect-square">
              <div className="h-1.5 bg-green-500"></div>
              <div className="p-3 flex flex-col h-full">
                <div className="mb-1">
                  <div className="text-xs font-medium text-green-600 px-1.5 py-0.5 bg-green-50 rounded-full inline-block mb-1">
                    Completed
                  </div>
                  <h4 className="font-semibold text-sm">Restaurant Website</h4>
                </div>
                
                <div className="text-xs text-gray-600 mb-2 flex-grow">
                  <div className="flex items-center">
                    <CheckCircle size={12} className="text-green-500 mr-1" />
                    <span>Deployed</span>
                  </div>
                </div>
                
                <button className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-lg w-full">
                  View Project
                </button>
              </div>
            </div>
            
            {/* Card 3: Another Completed Project */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 aspect-square">
              <div className="h-1.5 bg-green-500"></div>
              <div className="p-3 flex flex-col h-full">
                <div className="mb-1">
                  <div className="text-xs font-medium text-green-600 px-1.5 py-0.5 bg-green-50 rounded-full inline-block mb-1">
                    Completed
                  </div>
                  <h4 className="font-semibold text-sm">Portfolio App</h4>
                </div>
                
                <div className="text-xs text-gray-600 mb-2 flex-grow">
                  <div className="flex items-center">
                    <CheckCircle size={12} className="text-green-500 mr-1" />
                    <span>Published</span>
                  </div>
                </div>
                
                <button className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-lg w-full">
                  View Project
                </button>
              </div>
            </div>
            
            {/* Card 4: View All Projects */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 aspect-square">
              <div className="h-1.5 bg-purple-500"></div>
              <div className="p-3 flex flex-col h-full">
                <h4 className="font-semibold text-sm mb-1">View All Projects</h4>
                <p className="text-xs text-gray-600 mb-auto">Browse all your projects</p>
                <button className="w-full py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium">
                  Browse All
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Cards Section */}
        <div className="space-y-4">
          {/* Your Orders Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold text-sm">Recent Orders</h3>
              <a href="#" className="text-xs text-blue-600 flex items-center">
                View All <ChevronRight size={14} className="ml-1" />
              </a>
            </div>
            
            <div>
              <div className="p-3 border-b">
                <div className="flex justify-between mb-1">
                  <div className="font-medium text-sm">Website Updates</div>
                  <div className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                    Pending
                  </div>
                </div>
                <div className="text-xs text-gray-500">2 Mar 2025 • ₹35,000</div>
              </div>
              
              <div className="p-3">
                <div className="flex justify-between mb-1">
                  <div className="font-medium text-sm">SSL Certificate</div>
                  <div className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full">
                    Complete
                  </div>
                </div>
                <div className="text-xs text-gray-500">28 Feb 2025 • ₹5,000</div>
              </div>
            </div>
          </div>
          
          {/* Explore New Services Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold text-sm">Explore Services</h3>
              <a href="#" className="text-xs text-blue-600 flex items-center">
                View All <ChevronRight size={14} className="ml-1" />
              </a>
            </div>
            
            <div className="p-3">
              <p className="text-xs text-gray-600 mb-3">Enhance your website with our premium add-ons.</p>
              
              <div className="grid grid-cols-2 gap-2 w-full mb-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-xs font-medium">Dynamic Gallery</div>
                  <div className="text-xs text-gray-500">Show your work</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-xs font-medium">Live Chat</div>
                  <div className="text-xs text-gray-500">Connect now</div>
                </div>
              </div>
              
              <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">
                Explore All
              </button>
            </div>
          </div>
          
          {/* Chat with Developer Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Chat with Developer</h3>
            </div>
            
            <div className="p-3">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <MessageSquare size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Direct Support</div>
                  <div className="text-xs text-gray-500">Get expert help</div>
                </div>
              </div>
              
              <div className="mb-3">
                <textarea 
                  className="w-full border rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  rows="2" 
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              
              <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <footer className="bg-white border-t sticky bottom-0 z-10">
        <div className="flex justify-between items-center px-2">
          <button 
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'wallet' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={20} />
            <span className="text-xs mt-1">Wallet</span>
          </button>
          
          <button 
            className="flex flex-col items-center py-2 px-4"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-5 shadow-lg">
              <PlusCircle size={24} className="text-white" />
            </div>
            <span className="text-xs mt-1 text-blue-600">Explore</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={20} />
            <span className="text-xs mt-1">Orders</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-4 ${activeTab === 'account' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('account')}
          >
            <UserCircle size={20} />
            <span className="text-xs mt-1">Account</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MobileDashboard;