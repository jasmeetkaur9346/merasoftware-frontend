import React, { useState, useEffect, useContext } from 'react';
import { Bell, ChevronRight, Search, Filter, User, Plus, Menu, X, Home, Settings, FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Context from '../context';
import { useSelector } from 'react-redux';


const SupportCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
   const user = useSelector(state => state?.user?.user);
    const context = useContext(Context);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const tickets = [
    {
      id: 'TKT-001234',
      title: 'Cannot access my account settings',
      description: 'When I try to access my account settings page, I get a 404 error.',
      status: 'open',
      priority: 'high',
      date: '10 Mar 2025, 09:15 pm'
    },
    {
      id: 'TKT-002345',
      title: 'Double charged for monthly subscription',
      description: 'I was charged twice for my monthly subscription on March 1st.',
      status: 'closed',
      priority: 'medium',
      date: '5 Mar 2025, 04:57 pm'
    },
    {
      id: 'TKT-003456',
      title: 'Feature request: Dark mode support',
      description: 'It would be great to have dark mode support across the entire platform.',
      status: 'open',
      priority: 'low',
      date: '3 Mar 2025, 11:22 am'
    },
    {
      id: 'TKT-004567',
      title: 'Mobile app keeps crashing',
      description: 'The mobile app crashes whenever I try to upload images.',
      status: 'open',
      priority: 'high',
      date: '1 Mar 2025, 02:45 pm'
    }
  ];

  const filteredTickets = activeTab === 'all' 
    ? tickets 
    : tickets.filter(ticket => 
        activeTab === 'open' ? ticket.status === 'open' : ticket.status === 'closed'
      );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const MobileMenuButton = () => (
    <button 
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  const MobileMenu = () => (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white h-full w-64 shadow-lg transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* <div className="p-4 border-b flex justify-between items-center">
          <span className="font-bold text-lg">Support Center</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div> */}
        
        <div className="p-4">
          <button className="w-full bg-blue-600 text-white rounded-lg p-3 flex items-center justify-center space-x-2 mb-6 hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            <span>Create New Ticket</span>
          </button>
          
          <nav className="space-y-1">
            <button 
              onClick={() => {
                setActiveTab('all');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${activeTab === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <FileText size={18} />
              <span>All Tickets</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('open');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${activeTab === 'open' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <Home size={18} />
              <span>Open Tickets</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('closed');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${activeTab === 'closed' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <FileText size={18} />
              <span>Closed Tickets</span>
            </button>
          </nav>
          
          <div className="mt-8 pt-6 border-t">
            <button className="w-full text-left p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-50">
              <Settings size={18} />
              <span>User Information</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout user={user}>
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <MobileMenuButton />
            {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-800 ml-2">Support Center</h1> */}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* <button className="p-2 rounded-full hover:bg-gray-100 hidden sm:flex">
              <Bell size={20} />
            </button> */}
            <div className="h-8 w-8 rounded-full text-white flex items-center justify-center">
              {/* <User size={16} /> */}
            </div>
          </div>
        </div>
      </header>

      <MobileMenu />

      {/* Desktop Navigation Bar */}
      <div className="bg-white shadow-sm hidden md:block sticky top-16 z-10 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-4 font-medium text-sm relative ${activeTab === 'all' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span>All Tickets</span>
              {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('open')}
              className={`py-4 font-medium text-sm relative ${activeTab === 'open' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span>Open Tickets</span>
              {activeTab === 'open' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('closed')}
              className={`py-4 font-medium text-sm relative ${activeTab === 'closed' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span>Closed Tickets</span>
              {activeTab === 'closed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button className="py-4 font-medium text-sm text-gray-600 hover:text-gray-900 relative">
              <span>User Information</span>
            </button>
          </div>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            <span>Create New Ticket</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b bg-white sticky top-16 z-10">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === 'open' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Open
        </button>
        <button 
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === 'closed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Closed
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full p-2 sm:p-4">
        {/* Ticket list */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Actions row */}
          <div className="flex flex-col space-y-3 p-3 sm:p-4 border-b sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">
              {activeTab === 'all' ? 'All Tickets' : activeTab === 'open' ? 'Open Tickets' : 'Closed Tickets'} 
              <span className="text-gray-500 ml-2 text-sm">({filteredTickets.length})</span>
            </h2>
            
            {/* Mobile create button */}
            <div className="md:hidden flex">
              <button className="w-full bg-blue-600 text-white rounded-lg p-2 flex items-center justify-center">
                <Plus size={18} className="mr-2" />
                <span>Create New Ticket</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56 md:w-64">
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Filter size={16} />
              </button>
            </div>
          </div>
          
          {/* Tickets */}
          <div className="divide-y">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-wrap items-start justify-between mb-2 gap-y-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`h-2 w-2 rounded-full ${ticket.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="capitalize text-xs sm:text-sm text-gray-500">{ticket.status}</span>
                    <div className={`text-xs px-2 py-0.5 rounded-full text-white ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <span>{ticket.id}</span>
                    <span className="hidden xs:inline">{ticket.date}</span>
                    <span className="xs:hidden">{ticket.date.split(',')[0]}</span>
                  </div>
                </div>
                <div className="flex items-start sm:items-center justify-between">
                  <div className="pr-4">
                    <h3 className="font-medium text-sm sm:text-base">{ticket.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-1">{ticket.description}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 flex-shrink-0 mt-1 sm:mt-0" />
                </div>
              </div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No tickets found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default SupportCenter;