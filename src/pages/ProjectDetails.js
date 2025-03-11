import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bell, MessageCircle, X, Phone, Mail, ChevronRight, 
  Send, Paperclip, Clock, Check, Menu, Upload
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

  // This function properly checks payment status and handles pending approvals
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
    // Check if there are any pending transactions for this order first
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
      
      // Find the corresponding installment
      const relevantInstallment = order.installments.find(
        inst => inst.installmentNumber === installmentNumber
      );
      
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
  
  // Build timeline data from checkpoints
  const timeline = order.checkpoints ? order.checkpoints.map(checkpoint => {
    return {
      task: checkpoint.name,
      status: checkpoint.completed ? 'completed' : 'pending',
      date: checkpoint.completedAt ? formatDate(checkpoint.completedAt) : null
    };
  }) : [];
  
  // If there's an active task, mark it as in-progress
  if (timeline.length > 0) {
    const firstPendingIndex = timeline.findIndex(item => item.status === 'pending');
    if (firstPendingIndex !== -1) {
      timeline[firstPendingIndex].status = 'in-progress';
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">{order.productId?.serviceName}</h1>
              <span className="ml-4 text-sm text-gray-500">Type: {order.productId?.category?.split('_').join(' ')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span>Last Update: {formatDate(order.lastUpdated)} {formatTime(order.lastUpdated)}</span>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setChatOpen(!chatOpen)}
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
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

          <div className="grid grid-cols-12 gap-6">
            {/* Developer info */}
            <div className="col-span-12 lg:col-span-3">
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
                  <div className="flex space-x-3 mt-2">
                    <button 
                      disabled={!(order.assignedDeveloper && typeof order.assignedDeveloper === 'object')}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                        order.assignedDeveloper && typeof order.assignedDeveloper === 'object' ? 
                          'bg-green-100 text-green-600 hover:bg-green-200' : 
                          'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Phone size={16} />
                      <span>Call</span>
                    </button>
                    <button 
                      disabled={!(order.assignedDeveloper && typeof order.assignedDeveloper === 'object')}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                        order.assignedDeveloper && typeof order.assignedDeveloper === 'object' ? 
                          'bg-purple-100 text-purple-600 hover:bg-purple-200' : 
                          'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Mail size={16} />
                      <span>Email</span>
                    </button>
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
            
            {/* Progress with timeline */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h2 className="font-semibold border-b pb-2 mb-4">Project Progress & Timeline</h2>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-32 h-32">
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
                      <span className="text-sm">Completed: {order.checkpoints?.filter(c => c.completed).length || 0} tasks</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">In Progress: 1 task</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-sm">Pending: {order.checkpoints?.filter(c => !c.completed).length - 1 || 0} tasks</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
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
                  
                  {timeline.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`rounded-full w-4 h-4 ${getStatusColor(item.status)}`}></div>
                        {index < timeline.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.task}</h3>
                            <p className="text-sm text-gray-500">
                              {item.status === 'completed' ? 'Completed' : 
                               item.status === 'in-progress' ? 'In Progress' : 'Pending'}
                            </p>
                          </div>
                          {item.date && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {item.date}
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
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h2 className="font-semibold border-b pb-2 mb-4">Recent Updates</h2>
                {order.messages && order.messages.length > 0 ? (
                  <div className="space-y-3">
                    {order.messages.map((message, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-md ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{formatTime(message.timestamp)}</span>
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
      
      {/* Timeline Modal */}
      {showTimeline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-h-[80vh] overflow-y-auto w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Project Timeline</h3>
              <button 
                onClick={() => setShowTimeline(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {order.checkpoints?.map((checkpoint, index) => (
                <div key={checkpoint.checkpointId} className="relative">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      checkpoint.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="ml-3">
                      <h3 className="font-medium">{checkpoint.name}</h3>
                      <div className="text-sm text-gray-500">
                        {checkpoint.completed ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                  {index < order.checkpoints.length - 1 && (
                    <div className="absolute left-2 ml-[-1px] w-0.5 h-8 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProjectDetails;