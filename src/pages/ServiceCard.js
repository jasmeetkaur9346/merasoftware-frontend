import React, { useState } from 'react';
import { Search, ChevronRight, CheckCircle, MessageSquare, PlusCircle, Home, ShoppingBag, UserCircle, Wallet, LogOut, ChevronDown, ExternalLink, Settings, Bell } from 'lucide-react';

const DummyDashboard = () => {
  const [activeProject, setActiveProject] = useState(null);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md">
              M
            </div>
            <span className="font-bold text-xl">MeraSoftware</span>
          </div>
        </div>
        
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">Main Menu</div>
          <ul>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 border-r-4 border-blue-600">
                <Home size={20} className="mr-3" />
                <span className="font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <ShoppingBag size={20} className="mr-3" />
                <span className="font-medium">Your Orders</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <UserCircle size={20} className="mr-3" />
                <span className="font-medium">Account</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Wallet size={20} className="mr-3" />
                <span className="font-medium">Wallet</span>
              </a>
            </li>
          </ul>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase">Help & Support</div>
          <ul>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <MessageSquare size={20} className="mr-3" />
                <span className="font-medium">Contact Support</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                <Settings size={20} className="mr-3" />
                <span className="font-medium">Settings</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mt-auto border-t p-4">
          <a href="#" className="flex items-center text-red-600 hover:text-red-700">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 py-2 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
              
              <div className="relative">
                <button className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="Profile" />
                </div>
                <div>
                  <div className="font-medium text-sm">Sandeep Singh</div>
                  <div className="text-xs text-gray-500">Premium Client</div>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Welcome back,</div>
              <h2 className="text-xl font-bold text-gray-800">Let's see your projects</h2>
            </div>
            
            <div className="flex space-x-2">
              <div className="px-4 py-2 bg-white shadow-sm rounded-lg flex items-center">
                <Wallet size={18} className="text-blue-600 mr-2" />
                <span className="font-medium">₹230018</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700">
                <PlusCircle size={18} className="mr-2" />
                <span>New Project</span>
              </button>
            </div>
          </div>
          
          {/* Projects Section */}
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Your Projects</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Filter
                </button>
                <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Sort
                </button>
              </div>
            </div>
            
            {/* Project Cards - 4 cards in a single row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* Card 1: Start a New Project */}
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden text-white hover:shadow-xl transition-all p-6 flex flex-col items-center justify-center text-center transform hover:-translate-y-1">
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                    <PlusCircle size={32} />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Start a New Project</h4>
                  <p className="text-blue-100 text-sm mb-5">Begin your next success story with our team</p>
                  
                  <button className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md">
                    Create Project
                  </button>
                </div>
              </div>
              
              {/* Card 2: Completed Project */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-2 bg-green-500"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs font-medium text-green-600 mb-1 px-2 py-0.5 bg-green-50 rounded-full inline-block">
                        Completed
                      </div>
                      <h4 className="font-semibold">Restaurant Website</h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Completed: 2 Mar</div>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Successfully Deployed</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>All Features Working</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                      View Project
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                      <ExternalLink size={14} className="mr-1" /> 
                      Report
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Card 3: Another Completed Project */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-2 bg-green-500"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs font-medium text-green-600 mb-1 px-2 py-0.5 bg-green-50 rounded-full inline-block">
                        Completed
                      </div>
                      <h4 className="font-semibold">Portfolio App</h4>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Completed: 15 Jan</div>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>App Published</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Client Approved</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                      View Project
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                      <ExternalLink size={14} className="mr-1" /> 
                      Report
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Card 4: View All Projects */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-2 bg-purple-500"></div>
                <div className="p-5 h-full flex flex-col">
                  <div className="mb-4">
                    <h4 className="font-semibold">View All Projects</h4>
                    <p className="text-sm text-gray-600 mt-2">Browse your complete project history and portfolio.</p>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center bg-purple-50 p-3 rounded-lg mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <ExternalLink size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">All Projects</div>
                        <div className="text-xs text-gray-500">View your entire portfolio</div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-auto py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    Browse All Projects
                  </button>
                </div>
              </div>
            </div>
            
            {/* Secondary Cards Section - Your Orders, Explore New Services, Chat with Developer */}
            <div className="grid grid-cols-3 gap-6">
              {/* Your Orders Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="flex justify-between items-center p-5 border-b">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    View All <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
                
                <div className="divide-y">
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">Website Updates</div>
                      <div className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                        Pending
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Purchased on: 2 Mar 2025</div>
                    <div className="text-sm text-gray-500">Amount: ₹35,000</div>
                  </div>
                  
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">SSL Certificate</div>
                      <div className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                        Complete
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Purchased on: 28 Feb 2025</div>
                    <div className="text-sm text-gray-500">Amount: ₹5,000</div>
                  </div>
                </div>
              </div>
              
              {/* Explore New Services Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="flex justify-between items-center p-5 border-b">
                  <h3 className="font-semibold">Explore New Services</h3>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    View All <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 mb-4">Enhance your website with our premium add-ons.</p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full mb-5">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Dynamic Gallery</div>
                      <div className="text-xs text-gray-500">Showcase your work</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Live Chat Support</div>
                      <div className="text-xs text-gray-500">Connect instantly</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    Explore All Features
                  </button>
                </div>
              </div>
              
              {/* Chat with Developer Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5 border-b">
                  <h3 className="font-semibold">Chat with Developer</h3>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 18a6 6 0 0 0 6-6V6a6 6 0 1 0-12 0v6a6 6 0 0 0 6 6Z"></path><path d="M8 18v1a4 4 0 0 0 8 0v-1"></path></svg>
                    </div>
                    <div>
                      <div className="font-medium">Direct Support</div>
                      <div className="text-sm text-gray-500">Get help from our expert team</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <textarea 
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      rows="3" 
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                      Send Message
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DummyDashboard;