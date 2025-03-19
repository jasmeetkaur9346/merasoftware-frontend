import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bell, MessageCircle, X, Phone, Mail, ChevronRight, 
  Send, Paperclip, Clock, Check, Menu, Upload, ChevronDown
} from 'lucide-react';
import SummaryApi from '../common';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import DashboardLayout from '../components/DashboardLayout';
import UpdateRequestModal from '../components/UpdateRequestModal';
import PaymentAlert from '../components/PaymentAlert';

const ProjectDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);
  const [shouldShowPaymentAlert, setShouldShowPaymentAlert] = useState(false);
  const [currentInstallment, setCurrentInstallment] = useState(null);
  const [user, setUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'developer', text: 'Hello! I\'ve started working on your website structure.', time: '12:20 PM' }
  ]);
  const [isProjectPaused, setIsProjectPaused] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showAllUpdates, setShowAllUpdates] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    // Fetch user from local storage or state management
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // First fetch order data
      const orderResponse = await fetch(`${SummaryApi.orderDetails.url}/${orderId}`, {
        credentials: 'include',
      });
      const orderData = await orderResponse.json();
      
      if (orderData.success) {
        const order = orderData.data;
        
        // If there's an assigned developer ID but it's not already populated (it's just an ID string)
        if (order.assignedDeveloper && typeof order.assignedDeveloper === 'string') {
          try {
            // Use your new endpoint to fetch developer details by ID
            const devResponse = await fetch(`${SummaryApi.getSingleDeveloper.url}/${order.assignedDeveloper}`, {
              credentials: 'include',
            });
            const devData = await devResponse.json();
            
            if (devData.success) {
              // Combine the data
              order.assignedDeveloper = devData.data;
            }
          } catch (devError) {
            console.error("Error fetching developer:", devError);
          }
        }
        
        setOrder(order);

        // Check if this is a partial payment order and if we should show payment alert
        if (order.isPartialPayment) {
          checkPaymentStatus(order);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // First add a polling mechanism to frequently check payment status:
useEffect(() => {
  fetchOrderDetails();
  
  // Add a polling mechanism to refresh payment status
  const intervalId = setInterval(() => {
    fetchOrderDetails();
  }, 30000); // Check every 30 seconds
  
  return () => clearInterval(intervalId);
}, [orderId]);

// Then update the checkPaymentStatus function:
const checkPaymentStatus = async (order) => {
  console.log('Checking payment status for order:', order);
  
  // If project is already completed, don't show payment alert
  if (order.projectProgress >= 100 || order.currentPhase === 'completed') {
    console.log('Project is complete, not showing payment alert');
    setShouldShowPaymentAlert(false);
    setIsProjectPaused(false);
    return;
  }

  try {
    // IMPORTANT: Check if there are any pending transactions for this order first
    // This is critical for first-time payments that might not be reflected in the order yet
    const pendingTransResponse = await fetch(`${SummaryApi.checkPendingOrderTransactions.url}/${order._id}`, {
      credentials: 'include',
    });
    
    const pendingTransData = await pendingTransResponse.json();
    const hasPendingTransaction = pendingTransData.success && pendingTransData.data.hasPending;
    
    console.log('Has pending transaction?', hasPendingTransaction);
    
    // If there's a pending transaction, show the pending approval alert
    if (hasPendingTransaction) {
      // Get the installment number from the transaction
      const installmentNumber = pendingTransData.data.installmentNumber || 1;
      
      // Find the corresponding installment or create one if it doesn't exist
      let relevantInstallment = order.installments && order.installments.find(
        inst => inst.installmentNumber === installmentNumber
      );

      // If we can't find a relevant installment, create a placeholder
      if (!relevantInstallment) {
        relevantInstallment = {
          installmentNumber: installmentNumber || 1,
          amount: pendingTransData.data.amount || 0,
        };
      }
      
      // Set the current installment with pending-approval status
      setShouldShowPaymentAlert(true);
      setIsProjectPaused(false); // Not paused while payment is being verified
      setCurrentInstallment({
        ...relevantInstallment,
        paymentStatus: 'pending-approval'
      });
      
      console.log('Payment is pending approval - showing alert');
      return;
    }
  } catch (error) {
    console.error('Error checking pending transactions:', error);
    // Continue with regular flow if API fails
  }

  // Regular installment check flow
  if (order.installments && order.installments.length > 0) {
    console.log('Order installments:', order.installments);
    
    const nextUnpaidInstallment = order.installments.find(inst => !inst.paid);
    console.log('Next unpaid installment:', nextUnpaidInstallment);
    
    if (nextUnpaidInstallment) {
      // Check if there's a pending approval for this installment in the order record
      const isPendingApproval = 
        nextUnpaidInstallment.paymentStatus === 'pending-approval';
      
      console.log('Is pending approval?', isPendingApproval);
      console.log('Payment status:', nextUnpaidInstallment.paymentStatus);
      
      // If payment is awaiting verification based on order status, show the pending alert
      if (isPendingApproval) {
        console.log('Payment is pending approval - showing alert from order status');
        setShouldShowPaymentAlert(true);
        setIsProjectPaused(false); // Not paused while payment is being verified
        setCurrentInstallment({
          ...nextUnpaidInstallment,
          paymentStatus: 'pending-approval'
        });
        return;
      }
      
      // Determine if we should show the alert based on progress
      // Clear thresholds for each installment
      const shouldPause = 
        (nextUnpaidInstallment.installmentNumber === 2 && Math.round(order.projectProgress) >= 50) ||
        (nextUnpaidInstallment.installmentNumber === 3 && Math.round(order.projectProgress) >= 90);
      
      console.log('Should pause based on progress?', shouldPause);
      
      setShouldShowPaymentAlert(shouldPause);
      setIsProjectPaused(shouldPause);
      setCurrentInstallment(nextUnpaidInstallment);
    } else {
      // All installments paid, no alert needed
      console.log('All installments paid, no alert needed');
      setShouldShowPaymentAlert(false);
      setIsProjectPaused(false);
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (date) => {
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  const handleMakePayment = () => {
    if (currentInstallment) {
      navigate(`/installment-payment/${orderId}/${currentInstallment.installmentNumber}`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleTaskClick = (taskId) => {
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setShowAllUpdates(true);
    } else {
      setSelectedTaskId(taskId);
      setShowAllUpdates(false);
    }
  };

  const toggleShowAllUpdates = () => {
    setShowAllUpdates(!showAllUpdates);
    if (showAllUpdates) {
      setSelectedTaskId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="rounded-lg p-8">
            <TriangleMazeLoader />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout user={user}>
        <div className="p-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <h2 className="text-xl font-bold text-red-600 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get the current in-progress task and completed tasks
  const inProgressTask = order.checkpoints ? 
    order.checkpoints.find(checkpoint => !checkpoint.completed) : null;
  
  const completedTasks = order.checkpoints ? 
    [...order.checkpoints.filter(checkpoint => checkpoint.completed)].reverse() : [];

  // Filter messages based on selected task
  const filteredMessages = selectedTaskId ? 
    (order.messages || []).filter(msg => {
      // This assumes there's some relation between messages and tasks
      // You might need to adjust this logic based on your actual data structure
      return msg.checkpointId === selectedTaskId || 
             msg.message.toLowerCase().includes(
               order.checkpoints.find(cp => cp.checkpointId === selectedTaskId)?.name.toLowerCase() || ''
             );
    }) : 
    (order.messages || []);

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Payment Alert Banner */}
          {shouldShowPaymentAlert && currentInstallment && (
            <PaymentAlert 
              installmentNumber={currentInstallment.installmentNumber}
              amount={currentInstallment.amount}
              projectId={orderId}
              progress={Math.round(order.projectProgress)}
              paymentStatus={currentInstallment.paymentStatus || 'none'}
              onClick={handleMakePayment}
            />
          )}

          {/* Mobile View - Progress at the top */}
          <div className="md:hidden mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center border-b pb-2 mb-4">
                <h1 className="text-lg font-bold">{order.productId?.serviceName}</h1>
                <span className="ml-4 text-xs text-gray-500">Type: {order.productId?.category?.split('_').join(' ')}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-24 h-24">
                  {/* Progress circle with pulse effect */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className={isProjectPaused ? "text-red-500" : "text-blue-500"}
                      strokeWidth="10" 
                      strokeDasharray={`${order.projectProgress * 2.51} 251`} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    {/* Pulse animation for in-progress effect */}
                    {/* {!isProjectPaused && order.projectProgress < 100 && (
                      <circle 
                        className="text-blue-300 animate-ping opacity-75"
                        strokeWidth="2" 
                        stroke="currentColor"
                        fill="transparent" 
                        r="45" 
                        cx="50" 
                        cy="50" 
                      />
                    )} */}
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">{Math.round(order.projectProgress)}%</span>
                    {isProjectPaused && (
                      <span className="text-xs font-semibold text-red-500 mt-1">PAUSED</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 ml-4">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Completed: {completedTasks.length} tasks</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">In Progress: {inProgressTask ? '1' : '0'} task</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm">Pending: {order.checkpoints?.filter(c => !c.completed).length - (inProgressTask ? 1 : 0) || 0} tasks</span>
                  </div>
                </div>
              </div>

              {/* Current In-Progress Task for Mobile */}
              {inProgressTask && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Current Task</h3>
                  <div className="flex items-start p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">{inProgressTask.name}</h3>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-blue-600">
                        <Clock size={12} className="mr-1" />
                        <span>In progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Update for Mobile */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Recent Update</h3>
                  {order.messages && order.messages.length > 1 && (
                    <button 
                      onClick={toggleShowAllUpdates}
                      className="text-xs text-blue-600"
                    >
                      {showAllUpdates ? 'Show Less' : 'Show All'}
                    </button>
                  )}
                </div>
                
                {order.messages && order.messages.length > 0 ? (
                  <div>
                    <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
                      <p className="text-sm">{order.messages[0].message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatDateTime(order.messages[0].timestamp)}
                      </span>
                    </div>
                    
                    {showAllUpdates && order.messages.length > 1 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {order.messages.slice(1).map((message, index) => (
                          <div 
                            key={index}
                            className="p-3 rounded-md bg-gray-50 border border-gray-100 mb-2"
                          >
                            <p className="text-sm">{message.message}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
                              {formatDateTime(message.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No updates yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Developer info - last in mobile, left in desktop */}
            <div className="col-span-12 order-last md:order-first md:col-span-3">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h2 className="font-semibold border-b pb-2 mb-4">Developer</h2>
                <div className="flex flex-col items-center p-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center overflow-hidden">
                    {order.assignedDeveloper && order.assignedDeveloper.avatar ? (
                      <img 
                        src={order.assignedDeveloper.avatar} 
                        alt={order.assignedDeveloper.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="text-center mb-4">
                    <div className="font-medium text-lg">
                      {order.assignedDeveloper && typeof order.assignedDeveloper === 'object' ? 
                        order.assignedDeveloper.name : "Not Assigned"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.assignedDeveloper && typeof order.assignedDeveloper === 'object' ? 
                        order.assignedDeveloper.designation : "Developer Not Yet Assigned"}
                    </div>
                  </div>
                  
                  
                  {/* Request Update Button */}
                  <button 
                    onClick={() => setUpdateModalOpen(true)}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    Request Update
                  </button>
                </div>
              </div>
            </div>
            
            {/* Progress with timeline - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block col-span-12 md:col-span-6">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <div className="flex items-center border-b pb-2 mb-4">
                  <h1 className="text-xl font-bold">{order.productId?.serviceName}</h1>
                  <span className="ml-4 text-sm text-gray-500">Type: {order.productId?.category?.split('_').join(' ')}</span>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-32 h-32">
                    {/* Progress circle with pulse effect */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-gray-200" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className={isProjectPaused ? "text-red-500" : "text-blue-500"}
                        strokeWidth="10" 
                        strokeDasharray={`${order.projectProgress * 2.51} 251`} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      {/* Pulse animation for in-progress effect */}
                      {/* {!isProjectPaused && order.projectProgress < 100 && (
                        <circle 
                          className="text-blue-300 animate-ping opacity-75"
                          strokeWidth="2" 
                          stroke="currentColor"
                          fill="transparent" 
                          r="45" 
                          cx="50" 
                          cy="50" 
                        />
                      )} */}
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{Math.round(order.projectProgress)}%</span>
                      {isProjectPaused && (
                        <span className="text-xs font-semibold text-red-500 mt-1">PAUSED</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 ml-6">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Completed: {completedTasks.length} tasks</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">In Progress: {inProgressTask ? '1' : '0'} task</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-sm">Pending: {order.checkpoints?.filter(c => !c.completed).length - (inProgressTask ? 1 : 0) || 0} tasks</span>
                    </div>
                  </div>
                </div>
                
                {isProjectPaused && (
                  <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 font-medium">
                          Project paused at {Math.round(order.projectProgress)}% completion
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Please clear the payment of ₹{currentInstallment?.amount.toLocaleString()} to continue development
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4 mt-6">
                  {/* In Progress Task on top */}
                  {inProgressTask && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full w-4 h-4 bg-blue-500 animate-pulse"></div>
                        <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1">
                        <div 
                          className="flex justify-between items-start cursor-pointer"
                          onClick={() => handleTaskClick(inProgressTask.checkpointId)}
                        >
                          <div>
                            <h3 className="font-medium">{inProgressTask.name}</h3>
                            <div className="flex items-center text-sm text-blue-600">
                              <Clock size={14} className="mr-1" />
                              <span>In progress</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Completed Tasks below */}
                  {completedTasks.map((task, index) => (
                    <div key={task.checkpointId} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full w-4 h-4 bg-green-500"></div>
                        {index < completedTasks.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div 
                          className="flex justify-between items-start cursor-pointer"
                          onClick={() => handleTaskClick(task.checkpointId)}
                        >
                          <div>
                            <h3 className="font-medium">{task.name}</h3>
                            <div className="flex items-center text-sm text-green-600">
                              <Check size={14} className="mr-1" />
                              <span>Completed</span>
                            </div>
                          </div>
                          {task.completedAt && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {formatDateTime(task.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent Updates */}
            <div className="col-span-12 hidden md:block md:col-span-3">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h2 className="font-semibold">Recent Updates</h2>
                  {selectedTaskId && filteredMessages.length > 0 && (
                    <button 
                      onClick={toggleShowAllUpdates}
                      className="text-xs text-blue-600"
                    >
                      Show All
                    </button>
                  )}
                </div>
                
                {filteredMessages && filteredMessages.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredMessages.map((message, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-md ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm">{message.message}</p>
                        </div>
                        {/* Show checkpoint tag if it exists */}
                        {message.checkpointId && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                            {order.checkpoints.find(cp => cp.checkpointId === message.checkpointId)?.name || 'Task Update'}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatDateTime(message.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No updates yet</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Chat panel */}
      <div className={`fixed right-6 bottom-0 w-96 bg-white shadow-lg rounded-t-lg transition-all duration-300 transform ${chatOpen ? 'translate-y-0' : 'translate-y-full'} z-20`}>
        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-blue-500 text-white rounded-t-lg">
          <h3 className="font-medium">Chat with Developer</h3>
          <button 
            className="text-white hover:bg-blue-600 p-1 rounded-full"
            onClick={() => setChatOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender !== 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div 
                className={`max-w-xs rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} block text-right mt-1`}>
                  {message.time}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full ml-2 flex-shrink-0 flex items-center justify-center">
                  <span className="text-blue-500 text-sm font-semibold">You</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center">
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..." 
              className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Update Request Modal */}
      {updateModalOpen && (
        <UpdateRequestModal 
          plan={order}
          onClose={() => setUpdateModalOpen(false)}
          onSubmitSuccess={() => {
            setUpdateModalOpen(false);
            // Optionally refresh order data
            fetchOrderDetails();
          }}
        />
      )}
      
      {/* Chat button */}
      <button
        className="fixed right-6 bottom-6 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <MessageCircle size={20} />
      </button>
    </DashboardLayout>
  );
};

export default ProjectDetails;