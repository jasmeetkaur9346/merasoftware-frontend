import React, { useState } from 'react';

const DirectAccessTicketSystem = () => {
  // Ticket system state
  const [activeTab, setActiveTab] = useState('myTickets');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  
  // User information (hardcoded since we removed authentication)
  const currentUser = { 
    id: '123', 
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '555-123-4567',
    avatar: '👤'
  };
  
  // Sample ticket data (in a real app this would come from a database)
  const [userTickets, setUserTickets] = useState([
    {
      id: 'TKT-001234',
      userId: '123',
      category: 'Technical Issue',
      priority: 'high',
      status: 'open',
      subject: 'Cannot access my account settings',
      description: 'When I try to access my account settings page, I get a 404 error.',
      createdAt: '2025-03-10T14:32:10Z',
      updatedAt: '2025-03-10T15:45:22Z',
      messages: [
        {
          id: 'MSG-001',
          sender: 'system',
          content: 'Your ticket has been received and assigned to a support agent.',
          timestamp: '2025-03-10T14:32:15Z'
        },
        {
          id: 'MSG-002',
          sender: 'agent',
          agentName: 'John Support',
          content: 'Hi there! I\'m looking into this issue now. Could you please tell me which browser you\'re using?',
          timestamp: '2025-03-10T15:45:22Z'
        }
      ]
    },
    {
      id: 'TKT-002345',
      userId: '123',
      category: 'Billing Problem',
      priority: 'medium',
      status: 'closed',
      subject: 'Double charged for monthly subscription',
      description: 'I was charged twice for my monthly subscription on March 1st.',
      createdAt: '2025-03-01T10:15:32Z',
      updatedAt: '2025-03-05T11:27:44Z',
      messages: [
        {
          id: 'MSG-003',
          sender: 'system',
          content: 'Your ticket has been received and assigned to a support agent.',
          timestamp: '2025-03-01T10:15:40Z'
        },
        {
          id: 'MSG-004',
          sender: 'agent',
          agentName: 'Sarah Billing',
          content: 'I\'ve checked your account and confirmed the double charge. We\'ve processed a refund which should appear in 3-5 business days.',
          timestamp: '2025-03-03T14:22:10Z'
        },
        {
          id: 'MSG-005',
          sender: 'user',
          content: 'Thank you for the quick resolution!',
          timestamp: '2025-03-04T09:10:33Z'
        },
        {
          id: 'MSG-006',
          sender: 'agent',
          agentName: 'Sarah Billing',
          content: 'You\'re welcome! Is there anything else you need help with?',
          timestamp: '2025-03-04T10:45:18Z'
        },
        {
          id: 'MSG-007',
          sender: 'user',
          content: 'No, that\'s all. Thanks again!',
          timestamp: '2025-03-04T11:12:45Z'
        },
        {
          id: 'MSG-008',
          sender: 'system',
          content: 'This ticket has been marked as resolved and closed.',
          timestamp: '2025-03-05T11:27:44Z'
        }
      ]
    }
  ]);
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Categories for ticket dropdown
  const categories = [
    'Technical Issue',
    'Billing Problem',
    'Account Access',
    'Product Inquiry',
    'Feature Request',
    'Other'
  ];
  
  // Handle new ticket submission
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setTicketSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      const newTicket = {
        id: 'TKT-' + Math.floor(100000 + Math.random() * 900000),
        userId: currentUser.id,
        category: ticketCategory,
        priority: ticketPriority,
        status: 'open',
        subject: ticketDescription.split('\n')[0] || 'New ticket',
        description: ticketDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: 'MSG-' + Math.floor(100000 + Math.random() * 900000),
            sender: 'system',
            content: 'Your ticket has been received and assigned to a support agent.',
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      setUserTickets([newTicket, ...userTickets]);
      setTicketCategory('');
      setTicketPriority('medium');
      setTicketDescription('');
      setShowTicketForm(false);
      setTicketSubmitting(false);
    }, 1000);
  };
  
  // Handle sending a new message in a ticket
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const updatedTickets = userTickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const newMsg = {
          id: 'MSG-' + Math.floor(100000 + Math.random() * 900000),
          sender: 'user',
          content: newMessage,
          timestamp: new Date().toISOString()
        };
        
        return {
          ...ticket,
          updatedAt: new Date().toISOString(),
          messages: [...ticket.messages, newMsg]
        };
      }
      return ticket;
    });
    
    setUserTickets(updatedTickets);
    setNewMessage('');
    
    // Update selected ticket
    setSelectedTicket(
      updatedTickets.find(ticket => ticket.id === selectedTicket.id)
    );
  };
  
  // Get filtered tickets based on active tab
  const getFilteredTickets = () => {
    switch (activeTab) {
      case 'openTickets':
        return userTickets.filter(ticket => ticket.status === 'open');
      case 'closedTickets':
        return userTickets.filter(ticket => ticket.status === 'closed');
      case 'myTickets':
      default:
        return userTickets;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Get priority badge style
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Dashboard - Always Visible */}
      <div className="container mx-auto p-4">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Support Center</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{currentUser.avatar}</span>
              {/* <span className="font-medium">{currentUser.name}</span> */}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowTicketForm(true);
                  setSelectedTicket(null);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium"
              >
                Create New Ticket
              </button>
            </div>
            
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('myTickets');
                      setSelectedTicket(null);
                      setShowTicketForm(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeTab === 'myTickets' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Tickets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('openTickets');
                      setSelectedTicket(null);
                      setShowTicketForm(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeTab === 'openTickets' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Open Tickets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('closedTickets');
                      setSelectedTicket(null);
                      setShowTicketForm(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeTab === 'closedTickets' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Closed Tickets
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">User Information</h3>
              {/* <div className="text-sm text-gray-600 space-y-2">
                <p><span className="font-medium">Name:</span> {currentUser.name}</p>
                <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                <p><span className="font-medium">Phone:</span> {currentUser.phone}</p>
              </div> */}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            {selectedTicket ? (
              /* Ticket Detail View */
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedTicket.status)}`}>
                          {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(selectedTicket.priority)}`}>
                          {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                        </span>
                        <span className="text-gray-500 text-sm">
                          Ticket #{selectedTicket.id}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(selectedTicket.createdAt)}
                      {' • '}
                      Last updated: {formatDate(selectedTicket.updatedAt)}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedTicket.description}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="font-medium mb-3">Conversation</h3>
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-lg max-w-4xl ${
                          message.sender === 'user' 
                            ? 'ml-auto bg-blue-50 border border-blue-100' 
                            : message.sender === 'agent'
                              ? 'bg-white border border-gray-200 shadow-sm' 
                              : 'bg-gray-100 text-gray-600 text-sm'
                        }`}
                      >
                        {message.sender === 'agent' && (
                          <div className="font-medium text-blue-700 mb-1">
                            {message.agentName}
                          </div>
                        )}
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedTicket.status !== 'closed' && (
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage}>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Type your message here..."
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                          disabled={!newMessage.trim()}
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : showTicketForm ? (
              /* New Ticket Form */
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Create New Support Ticket</h2>
                  <button
                    onClick={() => setShowTicketForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmitTicket}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Issue Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Priority
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="low"
                          checked={ticketPriority === 'low'}
                          onChange={() => setTicketPriority('low')}
                          className="mr-2"
                        />
                        <span>Low</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="medium"
                          checked={ticketPriority === 'medium'}
                          onChange={() => setTicketPriority('medium')}
                          className="mr-2"
                        />
                        <span>Medium</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="high"
                          checked={ticketPriority === 'high'}
                          onChange={() => setTicketPriority('high')}
                          className="mr-2"
                        />
                        <span>High</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Please describe your issue in detail. The first line will be used as the subject."
                      required
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">
                      First line will be used as the ticket subject
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTicketForm(false)}
                      className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 font-medium"
                      disabled={ticketSubmitting}
                    >
                      {ticketSubmitting ? 'Submitting...' : 'Create Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Ticket List View */
              <div>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    {activeTab === 'openTickets' ? 'Open Tickets' : 
                     activeTab === 'closedTickets' ? 'Closed Tickets' : 'All Tickets'}
                  </h2>
                </div>
                
                <div>
                  {getFilteredTickets().length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No tickets found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {getFilteredTickets().map((ticket) => (
                        <div 
                          key={ticket.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{ticket.subject}</h3>
                            <span className="text-sm text-gray-500">
                              {formatDate(ticket.updatedAt)}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              #{ticket.id}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600 line-clamp-1">
                            {ticket.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DirectAccessTicketSystem;