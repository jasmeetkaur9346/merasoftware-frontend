import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Clock, Activity } from 'lucide-react';

const AdminWebsiteUpdates = () => {
  const [updatePlans, setUpdatePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);

  // Fetch all update plans
  const fetchUpdatePlans = async () => {
    try {
      const response = await fetch(SummaryApi.adminUpdatePlans.url, {
        credentials: 'include'
      });
      const data = await response.json();
      
      // console.log("अपडेट प्लान API रिस्पॉन्स:", data);
      if(data.success) {
        setUpdatePlans(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch update plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatePlans();
  }, []);

  // Calculate remaining days
  const calculateRemainingDays = (order) => {
    if (!order.createdAt || !order.productId?.validityPeriod) return 0;
    
    const validityInDays = order.productId.validityPeriod;
    
    const startDate = new Date(order.createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validityInDays);
    
    const today = new Date();
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, remainingDays);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle sending update and message
  const handleSendUpdate = async (planId) => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      // If an update is selected, update progress first
      if (selectedUpdate) {
        const updateResponse = await fetch(SummaryApi.updatePlanProgress.url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            planId,
            updateNumber: selectedUpdate,
            completed: true
          })
        });

        const updateData = await updateResponse.json();
        if (!updateData.success) {
          toast.error(updateData.message || 'Failed to update progress');
          return;
        }
      }

      // Send message update
      const messageResponse = await fetch(SummaryApi.sendProjectMessage.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: planId,
          message: message.trim(),
          messageId: editingMessageId,
          isEdit: Boolean(editingMessageId)
        })
      });

      const messageData = await messageResponse.json();
      
      if(messageData.success) {
        toast.success('Update sent successfully');
        setMessage('');
        setSelectedUpdate(null);
        setEditingMessageId(null);
        setIsModalOpen(false);
        fetchUpdatePlans();
      } else {
        toast.error(messageData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send update');
    }
  };

  const UpdatePlanCard = ({ plan }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg">{plan.productId?.serviceName}</h3>
          <p className="text-sm text-gray-600">Client: {plan.userId?.name}</p>
          <p className="text-sm text-gray-600">
            Purchased: {formatDate(plan.createdAt)}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPlan(plan);
            setSelectedUpdate(null);
            setMessage('');
            setEditingMessageId(null);
            setIsModalOpen(true);
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Updates Used</span>
          <span className="text-sm text-gray-600">{plan.updatesUsed} of {plan.productId?.updateCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="flex">
            {Array.from({ length: plan.productId?.updateCount || 0 }).map((_, index) => (
              <div 
                key={index}
                className={`h-2 flex-1 ${index < plan.updatesUsed ? 'bg-blue-600' : 'bg-gray-300'} ${index > 0 ? 'border-l border-white' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Validity Period</span>
          <span className="text-sm text-gray-600">{calculateRemainingDays(plan)} days left</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(calculateRemainingDays(plan) / plan.productId?.validityPeriod) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Preview latest message */}
      {plan.messages && plan.messages.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 border-t pt-3">
          <p className="font-medium">Latest Update:</p>
          <p className="mt-1">{plan.messages[plan.messages.length - 1].message}</p>
        </div>
      )}
    </div>
  );

  const EditModal = () => {
    if (!selectedPlan) return null;
    
    const totalUpdates = selectedPlan.productId?.updateCount || 0;
    const usedUpdates = selectedPlan.updatesUsed || 0;
    
    // Generate the next available update number
    const nextUpdateNumber = usedUpdates + 1;
    
    // Check if all updates have been used
    const allUpdatesUsed = usedUpdates >= totalUpdates;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              Update Plan: {selectedPlan.productId?.serviceName}
            </h3>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUpdate(null);
                setMessage('');
                setEditingMessageId(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Client Details */}
          <div className="mb-6">
            <p className="text-gray-600">Client: {selectedPlan.userId?.name}</p>
            <p className="text-gray-600">
              Purchased: {formatDate(selectedPlan.createdAt)}
            </p>
            <p className="text-gray-600">
              Validity: {calculateRemainingDays(selectedPlan)} days remaining
            </p>
          </div>

          {/* Update Selection Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Update Number
            </label>
            <select
              value={selectedUpdate || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setSelectedUpdate(value);
              }}
              className="w-full p-2 border rounded text-sm focus:outline-none focus:border-blue-500"
              disabled={allUpdatesUsed}
            >
              <option value="">Select update number...</option>
              {Array.from({ length: totalUpdates }).map((_, index) => {
                const updateNumber = index + 1;
                const isCompleted = updateNumber <= usedUpdates;
                const isNext = updateNumber === nextUpdateNumber;
                
                return (
                  <option 
                    key={updateNumber} 
                    value={updateNumber}
                    disabled={!isNext || isCompleted}
                  >
                    Update #{updateNumber} {isCompleted ? '(Completed)' : isNext ? '(Next)' : '(Future)'}
                  </option>
                );
              })}
            </select>
            {allUpdatesUsed && (
              <p className="mt-2 text-sm text-orange-600">
                All updates have been used for this plan.
              </p>
            )}
          </div>

          {/* Completed Updates */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Updates History</h4>
            <div className="space-y-1">
              {usedUpdates > 0 ? (
                Array.from({ length: usedUpdates }).map((_, index) => (
                  <div 
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <span className="text-green-500 mr-2">✓</span>
                    Update #{index + 1} Completed
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No updates have been used yet</p>
              )}
            </div>
          </div>

          {/* Previous Messages */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Previous Updates</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedPlan.messages && selectedPlan.messages.map((msg, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <p className="text-sm">{msg.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMessage(msg.message);
                      setEditingMessageId(msg.id || index);
                    }}
                    className="ml-2 text-blue-600 text-sm hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Message Section */}
          <div className="space-y-3">
            {selectedUpdate && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                Processing Update #{selectedUpdate}
              </div>
            )}
            {editingMessageId !== null && (
              <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded flex justify-between items-center">
                <span>Editing previous message</span>
                <button 
                  onClick={() => {
                    setMessage('');
                    setEditingMessageId(null);
                  }}
                  className="text-xs text-yellow-700 hover:text-yellow-900"
                >
                  Cancel Edit
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={(textArea) => {
                    // Keep focus on textarea if it already has focus
                    if (textArea && textArea === document.activeElement) {
                      const len = textArea.value.length;
                      textArea.setSelectionRange(len, len);
                    }
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={selectedUpdate ? "Message is required for update..." : "Send update to client..."}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px] resize-none"
                  autoFocus
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {message.length} characters
                </div>
              </div>
              <button
                onClick={() => handleSendUpdate(selectedPlan._id)}
                disabled={selectedUpdate && !message.trim()}
                className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
                  selectedUpdate && !message.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {editingMessageId !== null ? 'Save Changes' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading update plans...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Website Update Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {updatePlans.length > 0 ? (
          updatePlans.map((plan) => (
            <UpdatePlanCard key={plan._id} plan={plan} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No active update plans found.
          </div>
        )}
      </div>

      {isModalOpen && <EditModal />}
    </div>
  );
};

export default AdminWebsiteUpdates;