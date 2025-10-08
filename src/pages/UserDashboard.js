import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import RenewalModal from '../components/RenewalModal';
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
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [rejectedPayments, setRejectedPayments] = useState([]);
  const [pendingApprovalProjects, setPendingApprovalProjects] = useState([]);

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
            return ['standard_websites', 'dynamic_websites', 'cloud_software_development', 'app_development'].includes(category) ||
                   (category === 'website_updates');
          });
          
          // Sort by creation date (newest first)
          websiteProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setWebsiteProjects(websiteProjects);

          // Find projects pending approval - NEW CODE
        const pendingApprovalProjects = websiteProjects.filter(project => 
          project.orderVisibility === 'pending-approval'
        );
        setPendingApprovalProjects(pendingApprovalProjects);

         // New: Find rejected payment orders
         const rejectedOrders = allOrders.filter(order => 
          order.orderVisibility === 'payment-rejected'
        );
        setRejectedPayments(rejectedOrders);
          
          // Find active (in-progress) project
          const activeProj = websiteProjects.find(project => {
            const category = project.productId?.category?.toLowerCase();
            if (!category) return false;
            
            // Only website projects, not update plans
            if (['standard_websites', 'dynamic_websites', 'cloud_software_development', 'app_development'].includes(category)) {
              if (project.orderVisibility === 'pending-approval' || project.orderVisibility === 'payment-rejected') {
                return false; // Don't show as active if pending approval
              }

              return project.projectProgress < 100 || project.currentPhase !== 'completed';
            }
            return false;
          });
          // console.log("Setting active project in Dashboard:", activeProj);
          setActiveProject(activeProj || null);

         // Make sure your context has the updateActiveProject method
          if (activeProj) {
  // console.log("Dashboard updating active project in context");
  context.updateActiveProject(activeProj);
}
          
          // Find completed projects including expired update plans
          const completedAndRejected = websiteProjects.filter(project => {
            const category = project.productId?.category?.toLowerCase();
            if (!category) return false;
            
            // Check for rejected projects
            if (project.orderVisibility === 'payment-rejected') {
              return true; // Include all rejected projects
            }
            
            // Check for completed projects
            if (['standard_websites', 'dynamic_websites', 'cloud_software_development', 'app_development'].includes(category)) {
              return project.projectProgress === 100 && project.currentPhase === 'completed';
            } else if (category === 'website_updates') {
              // Include completed/expired update plans
              return !project.isActive || 
                     (project.updatesUsed >= project.productId?.updateCount) || 
                     (calculateRemainingDays(project) <= 0);
            }
            return false;
          });
          
          // Sort by most recent first (either completion date or rejection date)
          completedAndRejected.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
          setCompletedProjects(completedAndRejected);
          
          // We don't need separate rejectedPayments state anymore, as they're included in completedProjects
          // But we'll keep it for reference in other places
          const rejectedProjects = websiteProjects.filter(project => project.orderVisibility === 'payment-rejected');
          setRejectedPayments(rejectedProjects);
          
          // Find active update plan (including yearly renewable plans)
          const updatePlan = allOrders.find(order =>
            order.productId?.category === 'website_updates' &&
            order.isActive &&
            order.orderVisibility !== 'pending-approval' &&
            order.orderVisibility !== 'payment-rejected' &&
            (
              // Regular update plans
              (!order.productId?.isMonthlyRenewablePlan &&
               order.updatesUsed < order.productId?.updateCount &&
               calculateRemainingDays(order) > 0) ||
              // Yearly renewable plans
              (order.productId?.isMonthlyRenewablePlan &&
               order.totalYearlyDaysRemaining > 0)
            )
          );
          setActiveUpdatePlan(updatePlan || null);

          // Debug yearly plan data
          if (updatePlan && updatePlan.productId?.isMonthlyRenewablePlan) {
            console.log('🎯 YEARLY PLAN DEBUG:', {
              planId: updatePlan._id,
              serviceName: updatePlan.productId?.serviceName,
              isMonthlyRenewablePlan: updatePlan.productId?.isMonthlyRenewablePlan,
              yearlyPlanDuration: updatePlan.productId?.yearlyPlanDuration,
              monthlyRenewalCost: updatePlan.productId?.monthlyRenewalCost,
              isUnlimitedUpdates: updatePlan.productId?.isUnlimitedUpdates,
              totalYearlyDaysRemaining: updatePlan.totalYearlyDaysRemaining,
              currentMonthExpiryDate: updatePlan.currentMonthExpiryDate,
              currentMonthUpdatesUsed: updatePlan.currentMonthUpdatesUsed,
              updatesUsed: updatePlan.updatesUsed,
              updateCount: updatePlan.productId?.updateCount
            });
          }
          
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
    navigate('/');
  };
  
  const handleExplore = () => {
    navigate('/');
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

  const handleRenewPlan = () => {
    setShowRenewalModal(true);
  };

  const handleRenewalSuccess = (renewalData) => {
    // Refresh the dashboard data after successful renewal
    window.location.reload(); // Simple refresh - you can make this more elegant
  };

  const handleUpdateRequestCompletion = () => {
    // Update activeUpdatePlan state
    if (activeUpdatePlan) {
      // Create a copy of the current plan with incremented updatesUsed
      const updatedPlan = {
        ...activeUpdatePlan,
        updatesUsed: (activeUpdatePlan.updatesUsed || 0) + 1
      };
      
      // Check if all updates have been used
      if (updatedPlan.updatesUsed >= updatedPlan.productId?.updateCount) {
        // Move the plan to completed projects
        setCompletedProjects(prev => [updatedPlan, ...prev]);
        // Clear the active update plan
        setActiveUpdatePlan(null);
        // Show the start new project button
        setShowNewProjectButton(true);
      } else {
        // Just update the active plan with incremented updates
        setActiveUpdatePlan(updatedPlan);
      }
    }
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
    if (!plan) return 0;

    // For yearly renewable plans, use currentMonthExpiryDate
    if (plan.productId?.isMonthlyRenewablePlan && plan.currentMonthExpiryDate) {
      const today = new Date();
      const expiryDate = new Date(plan.currentMonthExpiryDate);
      const remainingDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return Math.max(0, remainingDays);
    }

    // For regular update plans
    if (!plan.createdAt || !plan.productId?.validityPeriod) return 0;

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
    activeProject={activeProject}
  >  
        
        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
          <div className="">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Welcome back card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 flex-1 shadow-sm border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Welcome back,</p>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">{user.name}</h1>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              {/* <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div> */}
              <p className="text-gray-600">Review your ongoing projects and track their progress</p>
            </div>
          </div>
          
          {/* Explore More card */}
          <Link to={"/"} className='hidden md:block'>
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 flex-1 shadow-sm border border-pink-200 cursor-pointer group hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center mr-3 group-hover:bg-pink-600 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-pink-700 font-medium group-hover:text-pink-800 transition-all">Discover more</p>
                <h2 className="text-2xl font-bold text-gray-800">Explore Our Services</h2>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-pink-200 transition-all">
                <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-600">Discover exciting features and plans for your project</p>
            </div>
          </div>
          </Link>
        </div>
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

              {pendingApprovalProjects && pendingApprovalProjects.length > 0 && (
                <div className="flex-shrink-0 border bg-yellow-50 border-yellow-200 rounded-xl overflow-hidden shadow-md relative">
                  <div className="h-2 bg-yellow-500"></div>
                  <div className="relative z-10 p-4">
                    <div className="flex justify-start mb-1">
                      <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1 animate-pulse"></div>
                        <span className="text-xs font-medium text-yellow-600">Awaiting Approval</span>
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                      {pendingApprovalProjects[0].productId?.serviceName || "Website Project"}
                    </h2>
                    <span className="text-xs text-gray-500 block mb-3">
                      Ordered: {formatDate(pendingApprovalProjects[0].createdAt)}
                    </span>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                          <Clock size={12} className="text-yellow-500" />
                        </div>
                        <span className="text-sm text-gray-700">Waiting for payment approval</span>
                      </div>
                      
                      <p className="text-xs text-gray-600 ml-7">
                        This usually takes 1-4 hours. You'll be notified once approved.
                      </p>
                      {/* <button 
                className="w-full py-2 bg-amber-500 rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-white text-sm font-medium group mt-8"
                onClick={() => handleViewProjectDetails(pendingApprovalProjects._id)}
              >
                <span>View Project</span>
                <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button> */}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Update Plan or Active Project Card - Should always be first if exists */}
              {activeUpdatePlan && (
  <div className={`flex-shrink-0 ${
    activeUpdatePlan.productId?.isMonthlyRenewablePlan
      ? calculateRemainingDays(activeUpdatePlan) <= 0
        ? 'bg-red-50 border-red-200'
        : 'bg-blue-50 border-blue-200'
      : 'bg-gray-50 border-blue-200'
  } border rounded-xl overflow-hidden shadow-md relative`}>
    {/* Card background with highlight effect */}
    <div className={`h-2 ${
      activeUpdatePlan.productId?.isMonthlyRenewablePlan
        ? calculateRemainingDays(activeUpdatePlan) <= 0
          ? 'bg-red-600'
          : 'bg-blue-600'
        : 'bg-blue-600'
    }`}></div>

    {/* Main content container */}
    <div className="relative z-10 p-4">
      {/* Status indicator pill */}
      <div className="flex justify-start mb-1">
        <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
          <div className={`w-1.5 h-1.5 rounded-full mr-1 animate-pulse ${
            activeUpdatePlan.productId?.isMonthlyRenewablePlan
              ? calculateRemainingDays(activeUpdatePlan) <= 0
                ? 'bg-red-500'
                : 'bg-blue-400'
              : 'bg-blue-400'
          }`}></div>
          <span className={`text-xs font-medium ${
            activeUpdatePlan.productId?.isMonthlyRenewablePlan
              ? calculateRemainingDays(activeUpdatePlan) <= 0
                ? 'text-red-600'
                : 'text-blue-600'
              : 'text-blue-600'
          }`}>
            {activeUpdatePlan.productId?.isMonthlyRenewablePlan
              ? calculateRemainingDays(activeUpdatePlan) <= 0
                ? 'Needs Renewal'
                : 'Yearly Plan Active'
              : 'Active Plan'}
          </span>
        </div>
      </div>

      {/* Plan name and updates indicator */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-bold text-gray-800">
            {activeUpdatePlan.productId?.serviceName || "Website Updates"}
          </h2>
          <span className="text-xs text-gray-500">
            Purchased: {formatDate(activeUpdatePlan.createdAt)}
          </span>
          {activeUpdatePlan.productId?.isMonthlyRenewablePlan && (
            <span className="text-xs text-purple-600 font-medium mt-1">
              Yearly Plan ({activeUpdatePlan.totalYearlyDaysRemaining || 0} days left)
            </span>
          )}
        </div>

        {/* Updates indicator */}
        <div className="relative w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
          {activeUpdatePlan.productId?.isMonthlyRenewablePlan ? (
            <div className="text-center flex flex-col items-center">
              {/* Loop/Refresh icon for yearly renewable plans */}
              <svg
                className="w-6 h- text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  animation: calculateRemainingDays(activeUpdatePlan) > 0 ? 'spin 3s linear infinite' : 'none'
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {/* <div className="text-xs text-blue-600 font-medium mt-1">Yearly</div> */}
            </div>
          ) : activeUpdatePlan.productId?.isUnlimitedUpdates ? (
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">∞</div>
              <div className="text-xs text-gray-500">Unlimited</div>
            </div>
          ) : (
            <svg viewBox="0 0 100 100" width="64" height="64">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${((activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)) / activeUpdatePlan.productId?.updateCount) * 264} 264`}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="62" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#3b82f6">
                {activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)}
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Days left and additional info */}
      <div className="mb-5 space-y-3">
        {activeUpdatePlan.productId?.isMonthlyRenewablePlan ? (
          <>
            {/* Current Month Progress for Yearly Plans */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Clock size={12} className="text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600 font-medium">Current Month</span>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {calculateRemainingDays(activeUpdatePlan)} days left
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    calculateRemainingDays(activeUpdatePlan) <= 3
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{
                    width: `${Math.max(5, (calculateRemainingDays(activeUpdatePlan) / 30) * 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Yearly Plan Progress */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-purple-600 font-medium">Yearly Plan</span>
                </div>
                <span className="text-xs font-bold text-purple-700">
                  {activeUpdatePlan.totalYearlyDaysRemaining || 365} days remaining
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{
                    width: `${Math.max(5, ((activeUpdatePlan.totalYearlyDaysRemaining || 365) / 365) * 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Monthly Updates Usage */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium text-green-700">This Month Updates</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-green-800">
                    {activeUpdatePlan.currentMonthUpdatesUsed || 0}
                  </span>
                  <span className="text-xs text-green-600 ml-1">Used</span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">Updates Available:</span>
                <span className="text-green-700 font-medium">∞ Unlimited</span>
              </div>
            </div>
          </>
        ) : (
          /* Regular Plans - Original Logic */
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Clock size={12} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-600">Days Left</span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {calculateRemainingDays(activeUpdatePlan)} days
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full shadow-inner overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  calculateRemainingDays(activeUpdatePlan) <= 3
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{
                  width: `${Math.max(5, (calculateRemainingDays(activeUpdatePlan) / activeUpdatePlan.productId?.validityPeriod) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {activeUpdatePlan.productId?.isMonthlyRenewablePlan && calculateRemainingDays(activeUpdatePlan) <= 0 ? (
          <button
            onClick={handleRenewPlan}
            className="flex-1 py-2 rounded-md flex items-center justify-center text-sm font-medium bg-red-600 text-white shadow-sm hover:shadow-md transition-all"
          >
            <RefreshCw size={14} className="mr-1" />
            Recharge Plan (₹{activeUpdatePlan.productId?.monthlyRenewalCost || 8000})
          </button>
        ) : (
          <button
            onClick={handleRequestUpdate}
            disabled={
              !activeUpdatePlan.productId?.isUnlimitedUpdates &&
              ((activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount || calculateRemainingDays(activeUpdatePlan) <= 0)
            }
            className={`flex-1 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-all ${
              !activeUpdatePlan.productId?.isUnlimitedUpdates &&
              ((activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount || calculateRemainingDays(activeUpdatePlan) <= 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <RefreshCw size={14} className="mr-1" />
            Request Update
          </button>
        )}
      </div>
    </div>
  </div>
            )}

              {/* Active Project Card */}
              {activeProject && !activeUpdatePlan && (
  <div className="flex-shrink-0 border bg-amber-50 border border-amber-200 rounded-xl overflow-hidden shadow-md relative">
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
            <span className="font-medium">{Math.round(activeProject.projectProgress) || 0}%</span>
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
        className="w-full py-2 bg-amber-500 rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-white text-sm font-medium group mt-8"
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
  const isRejected = project.orderVisibility === 'payment-rejected';
  
  return (
    <div key={project._id} className={`flex-shrink-0 border ${
      isRejected 
        ? 'bg-red-50 border-red-200' 
        : 'bg-green-50 border-emerald-200'
    } rounded-xl overflow-hidden shadow-md relative`}>
      {/* Card background with highlight effect */}
      <div className={`h-2 ${isRejected ? 'bg-red-600' : 'bg-emerald-600'}`}></div>
      
      {/* Main content container */}
      <div className="relative z-10 p-4">
        {/* Status label */}
        <div className="flex justify-start mb-1">
          <div className="px-2 py-0.5 bg-white rounded-full shadow-sm flex items-center">
            <div className={`w-1.5 h-1.5 ${isRejected ? 'bg-red-500' : 'bg-emerald-500'} rounded-full mr-1 animate-pulse`}></div>
            <span className={`text-xs font-medium ${isRejected ? 'text-red-600' : 'text-emerald-600'}`}>
              {isRejected ? 'Payment Rejected' : 'Completed'}
            </span>
          </div>
        </div>
        
        {/* Project name */}
        <h2 className="text-lg font-bold text-gray-800 mb-1">{project.productId?.serviceName || "Website Project"}</h2>
        <span className="text-xs text-gray-500 block mb-3">
          {isRejected 
            ? `Rejected: ${formatDate(project.updatedAt || project.createdAt)}`
            : isUpdatePlan 
              ? `Ended: ${formatDate(project.updatedAt || project.createdAt)}`
              : `Completed: ${formatDate(project.updatedAt || project.createdAt)}`
          }
        </span>
        
        {/* Status items */}
        <div className="mb-4">
          {isRejected ? (
            // For rejected projects
            <div className="bg-white p-3 rounded-md border border-red-100">
              <p className="text-sm text-gray-700 h-[50px]">
                {project.rejectionReason || "Your payment for this order was rejected."}
              </p>
            </div>
          ) : isUpdatePlan ? (
            // For completed update plans
            <>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">
                  Updates Used: {project.updatesUsed || 0} of {project.productId?.updateCount || 0}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Plan Completed</span>
              </div>
            </>
          ) : (
            // For completed website projects
            <>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Successfully Deployed</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center mr-2">
                  <Check size={12} className="text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">All Features Working</span>
              </div>
            </>
          )}
        </div>
        
        {/* Action button */}
        {isRejected ? (
          <div className="flex space-x-3">
            <button 
              className="flex-1 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-all flex items-center justify-center text-sm font-medium"
              onClick={() => navigate(`/project-details/${project._id}`)}
            >
              View Details
            </button>
          </div>
        ) : (
          <button 
            className="w-full py-2 bg-emerald-600 rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-white text-sm font-medium group"
            onClick={() => handleViewProjectDetails(project._id)}
          >
            <span>View {isUpdatePlan ? 'Details' : 'Project'}</span>
            <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </button>
        )}
      </div>
    </div>
  );
})}
              
              {/* View All Projects Card - Always shown */}
            <div className="flex-shrink-0 bg-purple-50 border border-purple-200 rounded-xl overflow-hidden shadow-md relative">
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
              const isRejected = project.orderVisibility === 'payment-rejected';
              const isCompleted = isUpdatePlan 
                ? (!project.isActive || project.updatesUsed >= project.productId?.updateCount || calculateRemainingDays(project) <= 0)
                : (project.projectProgress === 100 && project.currentPhase === 'completed');
              
              return (
                <div 
                  key={project._id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className={`h-2 ${
                    isRejected
                      ? 'bg-red-500'
                      : isCompleted
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                  }`}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className={`text-xs font-medium mb-1 px-2 py-0.5 rounded-full inline-block ${
                          isRejected
                            ? 'text-red-600 bg-red-50'
                            : isCompleted
                              ? 'text-green-600 bg-green-50'
                              : 'text-blue-600 bg-blue-50'
                        }`}>
                          {isRejected
                            ? 'Payment Rejected'
                            : isCompleted
                              ? 'Completed'
                              : 'In Progress'}
                        </div>
                        <h4 className="font-semibold">{project.productId?.serviceName || "Project"}</h4>
                      </div>
                      <div className="text-xs text-gray-500">
                        {isRejected ? (
                          <div>Rejected: {formatDate(project.updatedAt || project.createdAt)}</div>
                        ) : isCompleted ? (
                          <div>{isUpdatePlan ? 'Ended' : 'Completed'}: {formatDate(project.updatedAt || project.createdAt)}</div>
                        ) : (
                          <div>Started: {formatDate(project.createdAt)}</div>
                        )}
                      </div>
                    </div>
                    
                    {isRejected ? (
                      <div className="mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Payment verification failed</span>
                        </div>
                      </div>
                    ) : isCompleted ? (
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
                    
                    {isRejected ? (
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100"
                          onClick={() => {
                            setShowAllProjectsModal(false);
                            navigate(`/project-details/${project._id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    ) : (
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
                    )}
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

      {/* Renewal Modal */}
      {showRenewalModal && activeUpdatePlan && (
        <RenewalModal
          plan={activeUpdatePlan}
          onClose={() => setShowRenewalModal(false)}
          onRenewalSuccess={handleRenewalSuccess}
        />
      )}

      {/* Update Request Modal */}
      {showUpdateRequestModal && activeUpdatePlan && (
  <UpdateRequestModal
    plan={activeUpdatePlan}
    onClose={() => setShowUpdateRequestModal(false)}
    onSubmitSuccess={() => {
      // First update the local state immediately
      handleUpdateRequestCompletion();
      
      // Then fetch the updated data from the server
      const fetchUpdatedOrders = async () => {
        try {
          const response = await fetch(SummaryApi.ordersList.url, {
            method: SummaryApi.ordersList.method,
            credentials: 'include'
          });
          
          const data = await response.json();
          if (data.success) {
            // Update orders
            const allOrders = data.data || [];
            allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(allOrders.slice(0, 2));
            
            // Reprocess all data
            const websiteProjects = allOrders.filter(order => {
              const category = order.productId?.category?.toLowerCase();
              return ['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category) ||
                     (category === 'website_updates');
            });
            
            websiteProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setWebsiteProjects(websiteProjects);
            
            // Re-check if there's an active update plan
            const updatePlan = allOrders.find(order => 
              order.productId?.category === 'website_updates' && 
              order.isActive &&
              order.updatesUsed < order.productId?.updateCount &&
              calculateRemainingDays(order) > 0 &&
              order.orderVisibility !== 'pending-approval' && 
              order.orderVisibility !== 'payment-rejected'
            );
            
            // Set active update plan (could be null if all updates used)
            setActiveUpdatePlan(updatePlan || null);
            
            // Find active (in-progress) project
            const activeProj = websiteProjects.find(project => {
              const category = project.productId?.category?.toLowerCase();
              if (!category) return false;
              
              if (['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category)) {
                return project.projectProgress < 100 || project.currentPhase !== 'completed';
              }
              return false;
            });
            setActiveProject(activeProj || null);
            
            // Find completed projects
            const completed = websiteProjects.filter(project => {
              const category = project.productId?.category?.toLowerCase();
              if (!category) return false;
              
              if (['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category)) {
                return project.projectProgress === 100 && project.currentPhase === 'completed';
              } else if (category === 'website_updates') {
                return !project.isActive || 
                       (project.updatesUsed >= project.productId?.updateCount) || 
                       (calculateRemainingDays(project) <= 0);
              }
              return false;
            });
            setCompletedProjects(completed);
            
            // Determine whether to show "Start New Project" button
            const showNewProj = !activeProj && 
              (!updatePlan || 
               (updatePlan.updatesUsed >= updatePlan.productId?.updateCount) ||
               (calculateRemainingDays(updatePlan) <= 0)
              );
            
            setShowNewProjectButton(showNewProj);
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