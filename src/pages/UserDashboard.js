import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChevronRight, Check, PlusCircle, 
   ShoppingBag,  
  ExternalLink,  Clock,  RefreshCw,
  FileText,
} from 'lucide-react';
import SummaryApi from '../common';
import Context from '../context';
import UpdateRequestModal from '../components/UpdateRequestModal';
import DashboardLayout from '../components/DashboardLayout';
import displayINRCurrency from '../helpers/displayCurrency';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state?.user?.user);
  const context = React.useContext(Context);
  const dispatch = useDispatch();
  
  // States
  const [orders, setOrders] = useState([]);
  const [websiteProjects, setWebsiteProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeUpdatePlan, setActiveUpdatePlan] = useState(null);
  const [showNewProjectButton, setShowNewProjectButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showUpdateRequestModal, setShowUpdateRequestModal] = useState(false);
  const [showAllProjectsModal, setShowAllProjectsModal] = useState(false);

  useEffect(() => {
    // Fetch user orders
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(SummaryApi.ordersList.url, {
          method: SummaryApi.ordersList.method,
          credentials: 'include'
        });
        
        const data = await response.json();
        if (data.success) {
          // Get all orders and sort by creation date (newest first)
          const allOrders = data.data || [];
          allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          // Take only the 2 most recent orders for display
          setOrders(allOrders.slice(0, 2));
          
          // Filter website projects and update plans
          const websiteProjects = allOrders.filter(order => {
            const category = order.productId?.category?.toLowerCase();
            return ['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category) ||
                   (category === 'website_updates');
          });
          
          // Sort by creation date (newest first)
          websiteProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setWebsiteProjects(websiteProjects);
          
          // Find active (in-progress) project
          const activeProj = websiteProjects.find(project => {
            const category = project.productId?.category?.toLowerCase();
            if (!category) return false;
            
            // Only website projects, not update plans
            if (['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category)) {
              return project.projectProgress < 100 || project.currentPhase !== 'completed';
            }
            return false;
          });
          setActiveProject(activeProj || null);
          
          // Find completed projects including expired update plans
          const completed = websiteProjects.filter(project => {
            const category = project.productId?.category?.toLowerCase();
            if (!category) return false;
            
            if (['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category)) {
              return project.projectProgress === 100 && project.currentPhase === 'completed';
            } else if (category === 'website_updates') {
              // Include completed/expired update plans
              return !project.isActive || 
                     (project.updatesUsed >= project.productId?.updateCount) || 
                     (calculateRemainingDays(project) <= 0);
            }
            return false;
          });
          setCompletedProjects(completed);
          
          // Find active update plan
          const updatePlan = allOrders.find(order => 
            order.productId?.category === 'website_updates' && 
            order.isActive &&
            order.updatesUsed < order.productId?.updateCount &&
            calculateRemainingDays(order) > 0
          );
          setActiveUpdatePlan(updatePlan || null);
          
          // Determine if "Start New Project" button should be shown
          // Show only if no active project AND (no update plan OR update plan with no updates left)
          const showNewProj = !activeProj && 
            (!updatePlan || 
             (updatePlan.updatesUsed >= updatePlan.productId?.updateCount) ||
             (calculateRemainingDays(updatePlan) <= 0)
            );
          
          setShowNewProjectButton(showNewProj);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchOrders();
      // Use cart count and wallet balance from context instead of fetching again
      setWalletBalance(context.walletBalance || 0);
      setCartCount(context.cartProductCount || 0);
    }
  }, [user, context.walletBalance, context.cartProductCount]);

  const handleStartProject = () => {
    navigate('/start-new-project');
  };
  
  const handleExplore = () => {
    navigate('/start-new-project');
  };

  const handleViewAllOrders = () => {
    navigate('/order');
  };
  
  const handleViewProjectDetails = (orderId) => {
    navigate(`/project-details/${orderId}`);
  };
  
  const handleViewAllProjects = () => {
    setShowAllProjectsModal(true);
  };
  
  const handleRequestUpdate = () => {
    setShowUpdateRequestModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Calculate remaining days for an update plan
  const calculateRemainingDays = (plan) => {
    if (!plan || !plan.createdAt || !plan.productId?.validityPeriod) return 0;
    
    const validityInDays = plan.productId.validityPeriod;
    
    const startDate = new Date(plan.createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validityInDays);
    
    const today = new Date();
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, remainingDays);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        
        
        <div className="flex-1 flex flex-col">
          {/* <header className="bg-white shadow-sm border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              
              <div className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-64"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </header> */}
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-sm animate-pulse h-6 text-gray-500 mb-1 rounded w-24 bg-gray-200 "></div>
                <h2 className="text-xl animate-pulse h-6 font-bold text-gray-800 w-32 rounded bg-gray-200 "></h2>
              </div>
              
              {/* <div className="animate-pulse flex space-x-2">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div> */}
            </div>
            
            {/* Mobile-friendly loading grid */}
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="h-48 md:h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-48 md:h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-48 md:h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-48 md:h-64 bg-gray-200 rounded-xl"></div>
            </div>
            
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 md:h-80 bg-gray-200 rounded-xl"></div>
              <div className="h-64 md:h-80 bg-gray-200 rounded-xl"></div>
              <div className="h-64 md:h-80 bg-gray-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (  
    <DashboardLayout 
    user={user}
    walletBalance={walletBalance}
    cartCount={cartCount}
  >  
        
        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Welcome back,</div>
              <h2 className="text-xl font-bold text-gray-800">Let's see your projects</h2>
            </div>
            
            {/* <div className="flex space-x-2">
              <div className="px-4 py-2 bg-white shadow-sm rounded-lg flex items-center">
                <Wallet size={18} className="text-blue-600 mr-2" />
                <span className="font-medium">₹{walletBalance}</span>
              </div>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag size={18} className="mr-2" />
                <span>Cart ({cartCount})</span>
              </button>
            </div> */}
          </div>
          
          {/* Projects Section */}
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Your Projects</h3>
            </div>
            
            {/* Project Cards - 4 cards in a single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
               {/* Start New Project Card - Only shown when no active project/update plan */}
               {showNewProjectButton && (
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden text-white hover:shadow-xl transition-all px-6 py-4 flex flex-col items-center justify-center text-center transform hover:-translate-y-1">
                  <div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
                      <PlusCircle size={28} />
                    </div>
                    <h4 className="font-bold text-xl mb-1">Start a New Project</h4>
                    <p className="text-blue-100 text-sm mb-3">Begin your next success story with our team</p>
                    
                    <button 
                      className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-md"
                      onClick={handleStartProject}
                    >
                      Start New Project
                    </button>
                  </div>
                </div>
              )}

              {/* Active Update Plan or Active Project Card - Should always be first if exists */}
              {activeUpdatePlan && (
  <div className="flex-shrink-0 bg-gray-100 border rounded-xl overflow-hidden shadow-md relative">
    {/* Card background with highlight effect */}
    <div className="h-2 bg-blue-500"></div>
    
    {/* Main content container */}
    <div className="relative z-10 p-4">
      {/* Status indicator pill - Now inside main content */}
      <div className="flex justify-start mb-1">
        <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
          <span className="text-xs font-medium text-blue-500">Active Plan</span>
        </div>
      </div>
      
      {/* Plan name and updates indicator side by side */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-bold text-gray-800">{activeUpdatePlan.productId?.serviceName || "Website Updates"}</h2>
          <span className="text-xs text-gray-500">Purchased: {formatDate(activeUpdatePlan.createdAt)}</span>
        </div>
        
        {/* Updates circle indicator (now on right) */}
        <div className="relative w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg viewBox="0 0 100 100" width="64" height="64">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            
            {/* Progress arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${((activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)) / activeUpdatePlan.productId?.updateCount) * 264} 264`}
              transform="rotate(-90 50 50)"
            />
            
            {/* Inner text */}
            <text x="50" y="62" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#3b82f6">
              {activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)}
            </text>
          </svg>
        </div>
      </div>
      
      {/* Days left bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <Clock size={12} className="text-gray-400 mr-1" />
            <span className="text-xs text-gray-600">Days Left</span>
          </div>
          <span className="text-xs font-medium text-gray-700">{calculateRemainingDays(activeUpdatePlan)} days</span>
        </div>
        <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
            style={{ width: `${(calculateRemainingDays(activeUpdatePlan) / activeUpdatePlan.productId?.validityPeriod) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between gap-2">
        <button 
          onClick={handleRequestUpdate}
          disabled={(activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount || calculateRemainingDays(activeUpdatePlan) <= 0}
          className={`flex-1 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-all ${
            (activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount || calculateRemainingDays(activeUpdatePlan) <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 shadow-sm hover:shadow-md'
          }`}
        >
          <RefreshCw size={14} className="mr-1" /> 
          Request Update
        </button>
      </div>
    </div>
  </div>
            )}

              {/* Active Project Card */}
              {activeProject && !activeUpdatePlan && (
  <div className="flex-shrink-0 border bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
    {/* Card background with highlight effect */}
    <div className="h-2 bg-amber-500"></div>
    
    {/* Main content container */}
    <div className="relative z-10 p-4">
      {/* Status label */}
      <div className="flex justify-start mb-1">
        <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1 animate-pulse"></div>
          <span className="text-xs font-medium text-amber-500">In Progress</span>
        </div>
      </div>
      
      {/* Project name */}
      <h2 className="text-lg font-bold text-gray-800 mb-1">{activeProject.productId?.serviceName || "Website Development"}</h2>
      <span className="text-xs text-gray-500 block mb-3">
        Started: {formatDate(activeProject.createdAt)}
      </span>
      
      {/* Status items */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
            <Check size={12} className="text-amber-500" />
          </div>
          <span className="text-sm text-gray-700">Development in progress</span>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{activeProject.projectProgress || 0}%</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
              style={{ width: `${activeProject.projectProgress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Action button */}
      <button 
        className="w-full py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-amber-600 text-sm font-medium group"
        onClick={() => handleViewProjectDetails(activeProject._id)}
      >
        <span>View Project</span>
        <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </button>
    </div>
  </div>
            )}
              
              {/* Completed Projects Cards - Show up to 2 */}
              {completedProjects.slice(0, 2).map((project, index) => {
  const isUpdatePlan = project.productId?.category?.toLowerCase() === 'website_updates';
  
  return (
    <div key={project._id} className="flex-shrink-0 border  bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
      {/* Card background with highlight effect */}
      <div className="h-2 bg-green-500"></div>
      
      {/* Main content container */}
      <div className="relative z-10 p-4">
        {/* Status label */}
        <div className="flex justify-start mb-1">
        <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-600">Completed</span>
        </div>
      </div>
        
        {/* Project name */}
        <h2 className="text-lg font-bold text-gray-800 mb-1">{project.productId?.serviceName || "Website Project"}</h2>
        <span className="text-xs text-gray-500 block mb-3">
          {isUpdatePlan ? 'Ended' : 'Completed'}: {formatDate(project.updatedAt || project.createdAt)}
        </span>
        
        {/* Status items */}
        <div className="mb-4">
          {isUpdatePlan ? (
            <>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700">
                  Updates Used: {project.updatesUsed || 0} of {project.productId?.updateCount || 0}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700">Plan Completed</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700">Successfully Deployed</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700">All Features Working</span>
              </div>
            </>
          )}
        </div>
        
        {/* Action button */}
        <button 
          className="w-full py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-emerald-600 text-sm font-medium group"
          onClick={() => handleViewProjectDetails(project._id)}
        >
          <span>View {isUpdatePlan ? 'Details' : 'Project'}</span>
          <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </button>
      </div>
    </div>
  );
            })}
              
              {/* View All Projects Card - Always shown */}
            <div className="flex-shrink-0 bg-gray-100 border  rounded-xl overflow-hidden shadow-md relative">
                {/* Card background with highlight effect */}
                <div className="h-2 bg-purple-500"></div>
                
                {/* Main content container */}
                <div className="relative z-10 p-4">
                  {/* Status label */}
                  <div className="flex justify-start mb-1">
                      <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
                        <span className="text-xs font-medium text-purple-600">History</span>
                      </div>
                    </div>

                  {/* Title and description */}
                  <h2 className="text-lg font-bold text-gray-800 mb-1">View All Projects</h2>
                  <p className="text-xs text-gray-500 mb-9">Browse your complete project history and portfolio.</p>
                  
                  {/* Project section */}
                  <div className="hover:cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewAllProjects}>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg shadow-inner flex items-center justify-center mr-2">
                          <ExternalLink size={14} className="text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-800 font-medium">All Projects</h3>
                          <p className="text-xs text-gray-500">View your entire portfolio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* Secondary Cards Section - Your Orders, Explore New Services, Chat with Developer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Your Orders Card */}
              <div className="bg-white border rounded-xl overflow-hidden shadow-md border-gray-100">
  <div className="flex justify-between items-center p-5 border-b">
    <h3 className="font-semibold">Recent Orders</h3>
    
  </div>
  
  <div className="divide-y">
    {orders.length === 0 ? (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-2">
          <ShoppingBag className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">You don't have any orders yet.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
          onClick={handleExplore}
        >
          <ShoppingBag size={16} className="mr-2" />
          Explore Services
        </button>
      </div>
    ) : (
      <>
        <div className="max-h-52 overflow-y-auto">
          {orders.map(order => (
            <div
              key={order._id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/order/${order._id}`)}
            >
              <div className="mb-1">
                <div className="font-medium text-sm">{order.productId?.serviceName || "Service"}</div>
              </div>
              <div className="text-xs text-gray-500">Purchased on: {formatDate(order.createdAt)}</div>
              <div className="text-xs text-gray-500">Amount: {displayINRCurrency(order.price || 0)}</div>
            </div>
          ))}
        </div>
        
        {/* View All Orders button */}
        <div className="px-6 py-5 mt-5">
          <button
            className="w-full bg-gradient-to-r bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm rounded-lg font-medium transition-colors duration-300 shadow-sm"
            onClick={handleViewAllOrders}
          >
            View All Orders
          </button>
        </div>
      </>
    )}
  </div>
</div>
              
              {/* Explore New Services Card - Only shown if user has orders */}
              {orders.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="font-semibold">Explore More To Upgrade Your Website</h3>
              
                  </div>
                  
                  <div className="px-5 py-3">
                    <p className="text-gray-600 mb-4 text-xs">Enhance your website with our premium add-ons.</p>
                    
                    <div className="flex flex-col space-y-4 mb-6">
      <div 
        className="bg-gray-50 border border-gray-100 p-3 rounded-lg transition-all duration-300 hover:shadow-md hover:border-blue-200 cursor-pointer"
        onClick={handleExplore}
      >
        <div className="flex items-center">
          {/* Icon for Dynamic Gallery */}
          <div className="mr-4">
            <div className="p-2 bg-blue-100 rounded-lg inline-flex w-10 h-10 items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          {/* Title and description */}
          <div>
            <h3 className="font-medium text-gray-800 text-sm mb-1">Dynamic Gallery</h3>
            <p className="text-gray-500 text-xs line-clamp-1">Add dynamic gallery in your website to control your uploading data by yourself</p>
          </div>
        </div>
      </div>
      
      <div 
        className="bg-gray-50 border border-gray-100 p-3 rounded-lg transition-all duration-300 hover:shadow-md hover:border-blue-200 cursor-pointer"
        onClick={handleExplore}
      >
        <div className="flex items-center">
          {/* Icon for Live Chat Support */}
          <div className="mr-4">
            <div className="p-2 bg-blue-100 rounded-lg inline-flex w-10 h-10 items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          
          {/* Title and description */}
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Live Chat Support</h3>
            <p className="text-gray-500 text-xs line-clamp-1">Add live chat system on your website to chat realtime with your visitors</p>
          </div>
        </div>
      </div>
    </div>
                    
                    <button 
                      className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700"
                      onClick={handleExplore}
                    >
                      Explore All Features
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 opacity-70">
                  <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="font-semibold">Explore New Services</h3>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-gray-600 mb-4">Place your first order to explore our premium services.</p>
                    
                    <div className="grid grid-cols-2 gap-3 w-full mb-5">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="text-sm font-medium mb-1">Dynamic Gallery</div>
                        <div className="text-xs text-gray-500">Showcase your work</div>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="text-sm font-medium mb-1">Live Chat Support</div>
                        <div className="text-xs text-gray-500">Connect instantly</div>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                      onClick={handleExplore}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
              
              {/* Chat with Developer Card */}
              {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5 border-b">
                  <h3 className="font-semibold">Chat with Developer</h3>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <MessageSquare className="text-blue-600" size={24} />
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
                      disabled={orders.length === 0}
                    ></textarea>
                    {orders.length === 0 && (
                      <p className="text-xs text-orange-500 mt-1">Place an order to unlock chat support</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className={`flex-1 py-2 rounded-lg font-medium ${
                        orders.length === 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled={orders.length === 0}
                    >
                      Send Message
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-lg ${
                        orders.length === 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                      disabled={orders.length === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </main>
      
      {/* View All Projects Modal */}
      {showAllProjectsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">All Projects</h2>
              <button 
                onClick={() => setShowAllProjectsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {websiteProjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      setShowAllProjectsModal(false);
                      handleStartProject();
                    }}
                  >
                    Start Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {websiteProjects.map(project => {
                    const isUpdatePlan = project.productId?.category?.toLowerCase() === 'website_updates';
                    const isCompleted = isUpdatePlan 
                      ? (!project.isActive || project.updatesUsed >= project.productId?.updateCount || calculateRemainingDays(project) <= 0)
                      : (project.projectProgress === 100 && project.currentPhase === 'completed');
                    
                    return (
                      <div 
                        key={project._id} 
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className={`h-2 ${
                          isCompleted
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}></div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className={`text-xs font-medium mb-1 px-2 py-0.5 rounded-full inline-block ${
                                isCompleted
                                  ? 'text-green-600 bg-green-50'
                                  : 'text-blue-600 bg-blue-50'
                              }`}>
                                {isCompleted
                                  ? 'Completed'
                                  : 'In Progress'}
                              </div>
                              <h4 className="font-semibold">{project.productId?.serviceName || "Project"}</h4>
                            </div>
                            <div className="text-xs text-gray-500">
                              {isCompleted ? (
                                <div>{isUpdatePlan ? 'Ended' : 'Completed'}: {formatDate(project.updatedAt || project.createdAt)}</div>
                              ) : (
                                <div>Started: {formatDate(project.createdAt)}</div>
                              )}
                            </div>
                          </div>
                          
                          {isCompleted ? (
                            <div className="mb-4 text-sm text-gray-600">
                              {isUpdatePlan ? (
                                <div className="flex items-center">
                                  <Check size={16} className="text-green-500 mr-2" />
                                  <span>Updates Used: {project.updatesUsed || 0} of {project.productId?.updateCount || 0}</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Check size={16} className="text-green-500 mr-2" />
                                  <span>Successfully Completed</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mb-4 text-sm text-gray-600">
                              {isUpdatePlan ? (
                                <>
                                  <div className="flex items-center justify-between mb-1">
                                    <span>Updates Remaining</span>
                                    <span className="font-medium">
                                      {project.productId?.updateCount - (project.updatesUsed || 0)} of {project.productId?.updateCount}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                    <div 
                                      className="bg-blue-600 h-1.5 rounded-full" 
                                      style={{ 
                                        width: `${((project.productId?.updateCount - (project.updatesUsed || 0)) / project.productId?.updateCount) * 100}%` 
                                      }}
                                    ></div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between mb-1">
                                    <span>Progress</span>
                                    <span className="font-medium">{project.projectProgress || 0}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-600 h-1.5 rounded-full"
                                      style={{ width: `${project.projectProgress || 0}%` }}
                                    ></div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          
                          <button 
                            className={`w-full py-2 rounded-lg font-medium ${
                              isCompleted
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                            onClick={() => {
                              setShowAllProjectsModal(false);
                              handleViewProjectDetails(project._id);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Request Modal */}
      {showUpdateRequestModal && activeUpdatePlan && (
        <UpdateRequestModal 
          plan={activeUpdatePlan} 
          onClose={() => setShowUpdateRequestModal(false)}
          onSubmitSuccess={() => {
            // Refresh orders data after successful update request
            const fetchUpdatedOrders = async () => {
              try {
                const response = await fetch(SummaryApi.ordersList.url, {
                  method: SummaryApi.ordersList.method,
                  credentials: 'include'
                });
                
                const data = await response.json();
                if (data.success) {
                  const allOrders = data.data || [];
                  setOrders(allOrders);
                  
                  // Update active update plan
                  const updatedPlan = allOrders.find(order => 
                    order._id === activeUpdatePlan._id
                  );
                  if (updatedPlan) {
                    setActiveUpdatePlan(updatedPlan);
                  }
                }
              } catch (error) {
                console.error('Error fetching updated orders:', error);
              }
            };
            
            fetchUpdatedOrders();
          }}
        />
      )}
     </DashboardLayout>
  );
};

export default Dashboard;