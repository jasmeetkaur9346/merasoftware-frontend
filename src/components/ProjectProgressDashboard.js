import React from 'react';
import { ShoppingCart, ChevronRight, Activity, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProjectProgressDashboard = ({ project, isUpdatePlan = false, walletBalance = 0, onViewDetails }) => {
  const user = useSelector(state => state?.user?.user);
  const cartProductCount = useSelector(state => state?.cart?.cartProductCount) || 0;

  // Calculate remaining days
  const calculateRemainingDays = () => {
    if (!project.createdAt) return 0;
    
    let endDate;
    if (isUpdatePlan && project.productId?.validityPeriod) {
      // For update plans, use validityPeriod
      const startDate = new Date(project.createdAt);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + project.productId.validityPeriod);
    } else if (project.expectedCompletionDate) {
      // For projects, use expectedCompletionDate
      endDate = new Date(project.expectedCompletionDate);
    } else {
      // Default: 30 days from creation
      const startDate = new Date(project.createdAt);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
    }
    
    const today = new Date();
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, remainingDays);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <Link to="/">
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Explore
              </button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
              <div>
                <p className="text-xs text-green-600">Wallet Balance</p>
                <p className="font-bold text-green-700">₹{walletBalance}</p>
              </div>
            </div>
            
            {/* Cart Button */}
            <Link to="/cart" className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <ShoppingCart size={22} />
              {cartProductCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartProductCount}
                </span>
              )}
            </Link>
            
            {/* Profile Menu */}
            <Link to="/profile" className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <img 
                src={user?.profilePic || "/api/placeholder/150/150"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full" 
              />
              <span className="font-medium">{user?.name || "Profile"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Project Progress Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isUpdatePlan ? "Update Plan Progress" : "Project Progress"}
              </h2>
              <div className="flex items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                  {isUpdatePlan ? "Website Updates" : "Website Development"}
                </span>
                <button 
                  onClick={onViewDetails}
                  className="text-blue-600 flex items-center text-sm hover:text-blue-800"
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{project.productId?.serviceName}</h3>
                  <p className="text-blue-100 mt-1">Started: {formatDate(project.createdAt)}</p>
                  {project.expectedCompletionDate && (
                    <p className="text-blue-100">Deadline: {formatDate(project.expectedCompletionDate)}</p>
                  )}
                </div>
                <span className="bg-blue-800 text-blue-200 px-3 py-1 rounded-full text-xs font-bold">
                  {isUpdatePlan ? "Active Plan" : "In Progress"}
                </span>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {isUpdatePlan ? 
                      `Updates (${project.updatesUsed || 0}/${project.productId?.updateCount || 0})` : 
                      "Progress"
                    }
                  </span>
                  <span>
                    {isUpdatePlan ? 
                      `${Math.max(0, (project.productId?.updateCount || 0) - (project.updatesUsed || 0))} remaining` : 
                      `${project.projectProgress || 0}%`
                    }
                  </span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2">
                  {isUpdatePlan ? (
                    <div className="flex h-full">
                      {Array.from({ length: project.productId?.updateCount || 0 }).map((_, index) => (
                        <div 
                          key={index}
                          className={`flex-1 ${index < (project.updatesUsed || 0) ? 'bg-blue-300' : 'bg-white'} 
                                      first:rounded-l-full last:rounded-r-full border-r border-blue-800 last:border-0`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="bg-white rounded-full h-2" 
                      style={{ width: `${project.projectProgress || 0}%` }}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={onViewDetails}
                  className="w-full bg-white text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  {isUpdatePlan ? "Request Website Update" : "View Project Details"}
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Card (Orders) */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Project Details</h2>
              <Link to="/orders" className="text-blue-600 text-sm hover:text-blue-800">View All</Link>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">#{project._id.slice(-6)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{project.productId?.category?.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium flex items-center">
                    <Activity size={16} className="mr-1 text-green-500" />
                    {isUpdatePlan ? "Active" : project.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Remaining:</span>
                  <span className="font-medium flex items-center">
                    <Clock size={16} className="mr-1 text-blue-500" />
                    {calculateRemainingDays()} days
                  </span>
                </div>
                
                {isUpdatePlan && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updates Available:</span>
                    <span className="font-medium text-green-600">
                      {Math.max(0, (project.productId?.updateCount || 0) - (project.updatesUsed || 0))}
                    </span>
                  </div>
                )}
                
                {!isUpdatePlan && project.currentPhase && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Phase:</span>
                    <span className="font-medium capitalize">{project.currentPhase}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={onViewDetails}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  {isUpdatePlan ? "Manage Update Plan" : "View Full Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectProgressDashboard;