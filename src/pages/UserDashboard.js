import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, ChevronRight, CheckCircle, MessageSquare, PlusCircle, 
  Home, ShoppingBag, UserCircle, Wallet, LogOut, ChevronDown, 
  ExternalLink, Bell, Clock, ArrowRight, RefreshCw,
  FileText, Plus, User
} from 'lucide-react';
import SummaryApi from '../common';
import Context from '../context';
import UpdateRequestModal from '../components/UpdateRequestModal';
import DashboardLayout from '../components/DashboardLayout';

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
        <aside className="hidden md:block w-64 bg-white border-r shadow-sm">
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
            </ul>
          </div>
          
          <div className="mt-auto border-t p-4">
            <a href="#" className="flex items-center text-red-600 hover:text-red-700">
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </aside>
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              
              <div className="animate-pulse flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-64 hidden md:block"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 bg-gray-200 rounded w-32 hidden md:block"></div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Welcome back,</div>
                <h2 className="text-xl font-bold text-gray-800">Let's see your projects</h2>
              </div>
              
              <div className="animate-pulse flex space-x-2">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            
            {/* Mobile-friendly loading grid */}
            <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Welcome back,</div>
            <h2 className="text-xl font-bold text-gray-800">Let's see your projects</h2>
          </div>
          
          <div className="flex space-x-2">
            <div className="px-3 md:px-4 py-2 bg-white shadow-sm rounded-lg flex items-center">
              <Wallet size={16} className="text-blue-600 mr-1 md:mr-2" />
              <span className="font-medium text-sm md:text-base">₹{walletBalance}</span>
            </div>
            <button 
              className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag size={16} className="mr-1 md:mr-2" />
              <span className="text-sm md:text-base">Cart ({cartCount})</span>
            </button>
          </div>
        </div>
        
        {/* Projects Section */}
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Your Projects</h3>
          </div>
          
          {/* Project Cards - 2 cards in a row for mobile, 4 for desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {/* Active Update Plan or Active Project Card - Should always be first if exists */}
            {activeUpdatePlan && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-2 bg-blue-500"></div>
                <div className="p-3 md:p-5">
                  <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1 px-2 py-0.5 bg-blue-50 rounded-full inline-block">
                        Active Plan
                      </div>
                      <h4 className="font-semibold text-sm md:text-base">{activeUpdatePlan.productId?.serviceName || "Website Updates"}</h4>
                    </div>
                  </div>
                  
                  <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center justify-between mb-1">
                      <span>Updates Left</span>
                      <span className="font-medium">
                        {activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${((activeUpdatePlan.productId?.updateCount - (activeUpdatePlan.updatesUsed || 0)) / activeUpdatePlan.productId?.updateCount) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-1.5 text-xs md:text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    onClick={() => navigate(`/plan-details/${activeUpdatePlan._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Active Project Card */}
            {activeProject && !activeUpdatePlan && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-2 bg-blue-500"></div>
                <div className="p-3 md:p-5">
                  <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1 px-2 py-0.5 bg-blue-50 rounded-full inline-block">
                        In Progress
                      </div>
                      <h4 className="font-semibold text-sm md:text-base">{activeProject.productId?.serviceName || "Website Development"}</h4>
                    </div>
                  </div>
                  
                  <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center justify-between mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{activeProject.projectProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${activeProject.projectProgress || 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-1.5 text-xs md:text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    onClick={() => handleViewProjectDetails(activeProject._id)}
                  >
                    View Project
                  </button>
                </div>
              </div>
            )}
            
            {/* Completed Projects Cards - Show up to 2 */}
            {completedProjects.slice(0, 2).map((project, index) => {
              const isUpdatePlan = project.productId?.category?.toLowerCase() === 'website_updates';
              
              return (
                <div key={project._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="h-2 bg-green-500"></div>
                  <div className="p-3 md:p-5">
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <div>
                        <div className="text-xs font-medium text-green-600 mb-1 px-2 py-0.5 bg-green-50 rounded-full inline-block">
                          Completed
                        </div>
                        <h4 className="font-semibold text-sm md:text-base">{project.productId?.serviceName || "Website Project"}</h4>
                      </div>
                    </div>
                    
                    <div className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                        <span>{isUpdatePlan ? 'Plan Complete' : 'Deployed'}</span>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-1.5 text-xs md:text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      onClick={() => handleViewProjectDetails(project._id)}
                    >
                      View Project
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* Start New Project Card - Only shown when no active project/update plan */}
            {showNewProjectButton && (
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden text-white hover:shadow-xl transition-all p-3 md:p-5 flex flex-col items-center justify-center text-center transform hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto backdrop-blur-sm">
                    <PlusCircle size={24} />
                  </div>
                  <h4 className="font-bold text-base md:text-xl mb-1 md:mb-2">Start a New Project</h4>
                  <p className="text-blue-100 text-xs md:text-sm mb-3 md:mb-5">Begin your next success story</p>
                  
                  <button 
                    className="w-full py-1.5 md:py-2.5 bg-white text-blue-600 rounded-lg font-medium text-xs md:text-sm hover:bg-blue-50 transition-colors shadow-md"
                    onClick={handleStartProject}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
            
            {/* View All Projects Card - Always shown */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-2 bg-purple-500"></div>
              <div className="p-3 md:p-5 h-full flex flex-col">
                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-sm md:text-base">View All Projects</h4>
                  <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">Browse your project history</p>
                </div>
                
                <button 
                  className="w-full mt-auto py-1.5 md:py-2 bg-purple-600 text-white rounded-lg font-medium text-xs md:text-sm hover:bg-purple-700"
                  onClick={handleViewAllProjects}
                >
                  Browse All
                </button>
              </div>
            </div>
          </div>
          
          {/* Secondary Cards Section - Your Orders, Explore New Services, Chat with Developer */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
            {/* Your Orders Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center p-4 md:p-5 border-b">
                <h3 className="font-semibold text-sm md:text-base">Recent Orders</h3>
                <a 
                  href="#" 
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewAllOrders();
                  }}
                >
                  View All <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
              
              <div className="divide-y">
                {orders.length === 0 ? (
                  <div className="p-4 md:p-6 text-center">
                    <div className="text-gray-400 mb-2">
                      <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm">You don't have any orders yet.</p>
                    <button 
                      className="mt-3 md:mt-4 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm hover:bg-blue-700 inline-flex items-center"
                      onClick={handleExplore}
                    >
                      <ShoppingBag size={14} className="mr-1 md:mr-2" />
                      Explore Services
                    </button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div 
                      key={order._id} 
                      className="p-3 md:p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      <div className="mb-1">
                        <div className="font-medium text-sm md:text-base">{order.productId?.serviceName || "Service"}</div>
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">Purchased: {formatDate(order.createdAt)}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{order.productId?.price || 0}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Explore New Services Card - Only shown if user has orders */}
            {orders.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="flex justify-between items-center p-4 md:p-5 border-b">
                  <h3 className="font-semibold text-sm md:text-base">Explore New Services</h3>
                  <a 
                    href="#" 
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      handleExplore();
                    }}
                  >
                    View All <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
                
                <div className="p-4 md:p-5">
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Enhance your website with our premium add-ons.</p>
                  
                  <div className="grid grid-cols-2 gap-2 md:gap-3 w-full mb-4 md:mb-5">
                    <div className="bg-blue-50 p-2 md:p-3 rounded-lg cursor-pointer hover:bg-blue-100" onClick={handleExplore}>
                      <div className="text-xs md:text-sm font-medium mb-0.5 md:mb-1">Dynamic Gallery</div>
                      <div className="text-xs text-gray-500">Showcase your work</div>
                    </div>
                    <div className="bg-blue-50 p-2 md:p-3 rounded-lg cursor-pointer hover:bg-blue-100" onClick={handleExplore}>
                      <div className="text-xs md:text-sm font-medium mb-0.5 md:mb-1">Live Chat Support</div>
                      <div className="text-xs text-gray-500">Connect instantly</div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-1.5 md:py-2 bg-blue-600 text-white rounded-lg font-medium text-xs md:text-sm hover:bg-blue-700"
                    onClick={handleExplore}
                  >
                    Explore All Features
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 opacity-70">
                <div className="flex justify-between items-center p-4 md:p-5 border-b">
                  <h3 className="font-semibold text-sm md:text-base">Explore New Services</h3>
                </div>
                
                <div className="p-4 md:p-5">
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Place your first order to explore our premium services.</p>
                  
                  <div className="grid grid-cols-2 gap-2 md:gap-3 w-full mb-4 md:mb-5">
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                      <div className="text-xs md:text-sm font-medium mb-0.5 md:mb-1">Dynamic Gallery</div>
                      <div className="text-xs text-gray-500">Showcase your work</div>
                    </div>
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                      <div className="text-xs md:text-sm font-medium mb-0.5 md:mb-1">Live Chat Support</div>
                      <div className="text-xs text-gray-500">Connect instantly</div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-1.5 md:py-2 bg-blue-600 text-white rounded-lg font-medium text-xs md:text-sm hover:bg-blue-700"
                    onClick={handleExplore}
                  >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
              
              {/* Chat with Developer Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
              </div>
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
                                  <CheckCircle size={16} className="text-green-500 mr-2" />
                                  <span>Updates Used: {project.updatesUsed || 0} of {project.productId?.updateCount || 0}</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <CheckCircle size={16} className="text-green-500 mr-2" />
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