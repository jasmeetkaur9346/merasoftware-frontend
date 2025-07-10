import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  Check, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import Context from '../context';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import { useSelector } from 'react-redux';

const AdminTicketsDashboard = () => {
  // const { userDetails } = useContext(Context);
   // Redux स्टोर से प्राप्त करें
   const userDetails = useSelector((state) => state.user.user);
   const isInitialized = useSelector((state) => state.user.initialized);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({
    pending: 0,
    open: 0,
    closed: 0,
    total: 0
  });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch tickets from API
  const fetchTickets = async () => {
    if (!userDetails?._id) {
      console.log("No user ID available");
      return;
    }
    
    setLoading(true);
    try {
      let url = `${SummaryApi.getAllTickets.url}?page=${currentPage}`;
      
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      if (categoryFilter) {
        url += `&category=${categoryFilter}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await fetch(url, {
        method: SummaryApi.getAllTickets.method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTickets(result.data.tickets);
        setTotalPages(result.data.pagination.pages);
        setCounts(result.data.counts);
      } else {
        setError('Failed to load tickets');
        toast.error(result.message || 'Failed to load tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset all filters
  const handleReset = () => {
    setStatusFilter('');
    setCategoryFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  // Get status badge with proper styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <User className="h-3 w-3 mr-1" />
            Open
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Check className="h-3 w-3 mr-1" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Handle page change in pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Pagination UI component
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
          currentPage === 1 
            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Previous</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border ${
            i === currentPage
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
          currentPage === totalPages
            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Next</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    return (
      <div className="flex items-center justify-center mt-6">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {pages}
        </nav>
      </div>
    );
  };
  
  // Effect to load tickets on component mount and when dependencies change
  useEffect(() => {
    if (isInitialized && userDetails?._id) {
      // console.log("Fetching admin tickets for user:", userDetails._id);
      fetchTickets();
    }
  }, [currentPage, statusFilter, categoryFilter, searchTerm, userDetails, isInitialized]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Support Tickets Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-5 text-center">
            <h2 className="text-3xl font-bold text-gray-800">{counts.total}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Total Tickets</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-5 text-center">
            <h2 className="text-3xl font-bold text-yellow-600">{counts.pending}</h2>
            <p className="text-sm font-medium text-yellow-500 mt-1">Pending</p>
          </div>
        </div>
        
        <div className="bg-blue-50 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-5 text-center">
            <h2 className="text-3xl font-bold text-blue-600">{counts.open}</h2>
            <p className="text-sm font-medium text-blue-500 mt-1">Open</p>
          </div>
        </div>
        
        <div className="bg-gray-50 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-5 text-center">
            <h2 className="text-3xl font-bold text-gray-600">{counts.closed}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Closed</p>
          </div>
        </div>
      </div>
      
      {/* Main Tickets Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">All Support Tickets</h2>
        </div>
        
        {/* Filters */}
        <div className="p-5 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
                <option value="Product">Product</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="relative md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && setCurrentPage(1)}
                    placeholder="Search by ticket ID or subject"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 py-2"
                  />
                </div>
                <button
                  onClick={handleReset}
                  className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                  <span className="ml-2">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tickets Table */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <TriangleMazeLoader />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={fetchTickets}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            <button
              onClick={handleReset}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.ticketId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.userId?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/admin-tickets/${ticket.ticketId}`}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1"
                      >
                        Manage <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && tickets.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTicketsDashboard;