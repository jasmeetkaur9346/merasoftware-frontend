import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FileText, Clock, ArrowRight, ShoppingCart, ChevronRight, CheckCircle, RefreshCw, Plus, User } from "lucide-react";
import SummaryApi from '../common';
import Context from '../context';
import UpdateRequestModal from '../components/UpdateRequestModal';

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
          
          // Filter website projects
          const websiteProjects = allOrders.filter(order => {
            const category = order.productId?.category?.toLowerCase();
            return ['standard_websites', 'dynamic_websites', 'web_applications', 'mobile_apps'].includes(category);
          });
          
          // Sort by creation date (newest first)
          websiteProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setWebsiteProjects(websiteProjects);
          
          // Find active (in-progress) project
          const activeProj = websiteProjects.find(project => 
            project.projectProgress < 100 || project.currentPhase !== 'completed'
          );
          setActiveProject(activeProj || null);
          
          // Find completed projects
          const completed = websiteProjects.filter(project => 
            project.projectProgress === 100 && project.currentPhase === 'completed'
          );
          setCompletedProjects(completed);
          
          // Find active update plan
          const updatePlan = allOrders.find(order => 
            order.productId?.category === 'website_updates' && 
            order.isActive
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
    navigate('/all-projects');
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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-gray-200 rounded col-span-1"></div>
                  <div className="h-20 bg-gray-200 rounded col-span-1"></div>
                  <div className="h-20 bg-gray-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section with wallet and profile */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={handleExplore}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Explore
          </button>
        </div>
        <div className="flex items-center gap-4">
          {/* Wallet Balance */}
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <div className="text-sm text-green-700">Wallet Balance</div>
            <div className="font-bold text-green-700">₹{walletBalance}</div>
          </div>
          
          {/* Cart */}
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartCount}
            </span>
          </div>
          
          {/* Profile */}
          <div 
            className="bg-gray-100 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/profile')}
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="w-6 h-6 rounded-full" />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
            <div className="font-medium">{user?.name || 'Profile'}</div>
          </div>
        </div>
      </header>

      {/* Main content: Grid with 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Update Plan takes the first column if it exists */}
        {activeUpdatePlan ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Website Update Plan</h2>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{activeUpdatePlan.productId?.serviceName}</h3>
              
              <div className="space-y-4 mb-4">
                {/* Updates Remaining */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Updates Remaining</span>
                    <span className="font-medium">
                      {activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)} of {activeUpdatePlan.productId?.updateCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${((activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)) / activeUpdatePlan.productId?.updateCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Validity Period */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Validity Period</span>
                    <span className="font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {calculateRemainingDays(activeUpdatePlan)} days left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(calculateRemainingDays(activeUpdatePlan) / activeUpdatePlan.productId?.validityPeriod) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleRequestUpdate}
                disabled={(activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount || calculateRemainingDays(activeUpdatePlan) <= 0}
                className={`w-full py-2 rounded-lg font-medium flex items-center justify-center ${
                  (activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount || calculateRemainingDays(activeUpdatePlan) <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Request Website Update
              </button>
              
              {(activeUpdatePlan.updatesUsed || 0) >= activeUpdatePlan.productId?.updateCount && (
                <p className="text-orange-600 text-xs mt-2 text-center">
                  You've used all your updates. Please purchase a new plan.
                </p>
              )}
              
              {calculateRemainingDays(activeUpdatePlan) <= 0 && (
                <p className="text-orange-600 text-xs mt-2 text-center">
                  Your update plan has expired. Please purchase a new plan.
                </p>
              )}
            </div>
          </div>
        ) : null}
        
        {/* Active Project or Completed Project in third column */}
        {activeProject ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Project Progress</h2>
              <div className="flex gap-2">
                <button 
                  className="text-blue-600 text-sm hover:text-blue-800"
                  onClick={handleViewAllProjects}
                >
                  All Projects
                </button>
                <button 
                  className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                  onClick={() => handleViewProjectDetails(activeProject._id)}
                >
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="bg-blue-600 text-white p-6 relative">
              <h3 className="text-xl font-semibold mb-1">
                {activeProject.productId?.serviceName || "Website Development"}
              </h3>
              
              <div className="mb-4">
                <div className="text-sm text-blue-200 mb-0.5">
                  Started: {formatDate(activeProject.createdAt)}
                </div>
                {activeProject.expectedCompletionDate && (
                  <div className="text-sm text-blue-200">
                    Deadline: {formatDate(activeProject.expectedCompletionDate)}
                  </div>
                )}
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{activeProject.projectProgress || 0}%</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full"
                    style={{ width: `${activeProject.projectProgress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="absolute right-6 top-6 px-3 py-1 bg-blue-700 text-white text-sm rounded-full">
                {activeProject.status === 'in_progress' ? 'In Progress' : activeProject.status}
              </div>
              
              <button 
                className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg w-full text-center font-medium hover:bg-blue-50"
                onClick={() => handleViewProjectDetails(activeProject._id)}
              >
                View Project Details
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {completedProjects.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Completed Project</h2>
              <div className="flex gap-2">
                <button 
                  className="text-blue-600 text-sm hover:text-blue-800"
                  onClick={handleViewAllProjects}
                >
                  All Projects
                </button>
                <button 
                  className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                  onClick={() => handleViewProjectDetails(completedProjects[0]._id)}
                >
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="bg-green-600 text-white p-6 relative">
              <h3 className="text-xl font-semibold mb-1">
                {completedProjects[0].productId?.serviceName || "Website Development"}
              </h3>
              
              <div className="mb-4">
                <div className="text-sm text-green-200 mb-0.5">
                  Completed: {formatDate(completedProjects[0].updatedAt)}
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-medium">Project Successfully Completed</span>
              </div>
              
              <div className="absolute right-6 top-6 px-3 py-1 bg-green-700 text-white text-sm rounded-full">
                Completed
              </div>
              
              <button 
                className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg w-full text-center font-medium hover:bg-green-50"
                onClick={() => handleViewProjectDetails(completedProjects[0]._id)}
              >
                View Project Report
              </button>
            </div>
          </div>
        )}
        {showNewProjectButton && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Start a New Project</h2>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="text-blue-500 w-8 h-8" />
                </div>
                
                <p className="text-gray-600 mb-6 text-center">
                  {completedProjects.length > 0 
                    ? "Ready to begin your next project? Click the button below to get started."
                    : "You haven't started any projects yet. Click the button below to start a new project."}
                </p>
                
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  onClick={handleStartProject}
                >
                  Start New Project
                </button>
              </div>
            </div>
          </div>
        )}
          </div>
        )}

        
        
        {/* Orders box - now in the last column of the main grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Your Orders</h2>
          </div>
          
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-gray-400 mb-2">
                  <ShoppingCart className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">You don't have any orders yet.</p>
              </div>
            ) : (
              <>
                {orders.map(order => (
                  <div 
                    key={order._id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer mb-4 last:mb-0"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <h3 className="font-semibold">{order.productId?.serviceName}</h3>
                          <p className="text-sm text-gray-500">
                            Purchased on: {formatDate(order.createdAt)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: <span className="capitalize">{order.status}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-blue-600 font-medium flex items-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  className="w-full mt-4 text-blue-600 hover:text-blue-800"
                  onClick={handleViewAllOrders}
                >
                  View All Orders
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
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
    </div>
  );
};

export default Dashboard;