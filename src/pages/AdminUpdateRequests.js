import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Clock, Eye, UserPlus, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const AdminUpdateRequests = () => {
  const [updateRequests, setUpdateRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Fetch all update requests
  const fetchUpdateRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.adminUpdateRequests.url, {
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        console.log("Update requests data:", data.data);  // Log the data to inspect
        setUpdateRequests(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch update requests');
      }
    } catch (error) {
      console.error('Error fetching update requests:', error);
      toast.error('Failed to fetch update requests');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch developers for assignment
  const fetchDevelopers = async () => {
    try {
      const response = await fetch(SummaryApi.allDevelopers.url, {
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        setDevelopers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
    }
  };
  
  useEffect(() => {
    fetchUpdateRequests();
    fetchDevelopers();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle assigning developer
  const handleAssignDeveloper = async () => {
    if (!selectedDeveloper) {
      toast.error('Please select a developer');
      return;
    }
    
    try {
      const response = await fetch(SummaryApi.assignUpdateRequestDeveloper.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          developerId: selectedDeveloper
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Developer assigned successfully');
        setIsAssignModalOpen(false);
        setSelectedDeveloper('');
        
        // Update local state
        setUpdateRequests(prev => prev.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, assignedDeveloper: data.data.developer, status: 'in_progress' } 
            : req
        ));
        
        // Refresh the list
        fetchUpdateRequests();
      } else {
        toast.error(data.message || 'Failed to assign developer');
      }
    } catch (error) {
      console.error('Error assigning developer:', error);
      toast.error('Failed to assign developer');
    }
  };
  
  // Handle sending message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    try {
      const response = await fetch(SummaryApi.updateRequestMessage.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          message: message.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Message sent successfully');
        setMessage('');
        
        // Update local state
        const updatedRequest = { 
          ...selectedRequest,
          developerMessages: [
            ...(selectedRequest.developerMessages || []),
            { message: message.trim(), timestamp: new Date() }
          ]
        };
        
        setSelectedRequest(updatedRequest);
        setUpdateRequests(prev => prev.map(req => 
          req._id === selectedRequest._id ? updatedRequest : req
        ));
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Handle completing update request
  const handleCompleteRequest = async () => {
    try {
      const response = await fetch(SummaryApi.completeUpdateRequest.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedRequest._id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Update request marked as completed');
        
        // Update local state
        const updatedRequest = { 
          ...selectedRequest,
          status: 'completed',
          completedAt: new Date()
        };
        
        setSelectedRequest(updatedRequest);
        setUpdateRequests(prev => prev.map(req => 
          req._id === selectedRequest._id ? updatedRequest : req
        ));
        
        // Close modal after delay
        setTimeout(() => {
          setIsDetailModalOpen(false);
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to complete request');
      }
    } catch (error) {
      console.error('Error completing request:', error);
      toast.error('Failed to complete request');
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, statusText;
    
    switch (status) {
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        statusText = 'Pending';
        break;
      case 'in_progress':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        statusText = 'In Progress';
        break;
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        statusText = 'Completed';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = 'Rejected';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        statusText = status;
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {statusText}
      </span>
    );
  };
  
  // Request Detail Modal
  const RequestDetailModal = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Update Request Details</h3>
              <p className="text-sm text-gray-600">
                Submitted: {formatDate(selectedRequest.createdAt)}
              </p>
            </div>
            <StatusBadge status={selectedRequest.status} />
            <button 
              onClick={() => setIsDetailModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* User and Plan Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Client Information</h4>
                <p><span className="text-gray-600">Name:</span> {selectedRequest.userId?.name}</p>
                <p><span className="text-gray-600">Email:</span> {selectedRequest.userId?.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Update Plan</h4>
                <p>
                  <span className="text-gray-600">Plan:</span> {selectedRequest.updatePlanId?.productId?.serviceName}
                </p>
                <p>
                  <span className="text-gray-600">Updates Used:</span> {selectedRequest.updatePlanId?.updatesUsed} of {selectedRequest.updatePlanId?.productId?.updateCount}
                </p>
              </div>
            </div>
            
            {/* Developer Assignment */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Developer Assignment</h4>
              
              {selectedRequest.assignedDeveloper ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p>
                    <span className="text-gray-700 font-medium">Assigned Developer:</span> {selectedRequest.assignedDeveloper.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.assignedDeveloper.email} • {selectedRequest.assignedDeveloper.department}
                  </p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setIsAssignModalOpen(true);
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assign Developer
                  </button>
                </div>
              )}
            </div>
            
            {/* Client Instructions */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Client Instructions</h4>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                {selectedRequest.instructions && selectedRequest.instructions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.instructions.map((instruction, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm">{instruction.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(instruction.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No instructions provided</p>
                )}
              </div>
            </div>
            
            {/* Uploaded Files */}
            <div className="mb-6">
  <h4 className="font-medium mb-2">Uploaded Files</h4>
  <div className="border rounded-lg p-4">
    {selectedRequest.files && selectedRequest.files.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedRequest.files.map((file, index) => (
          <div key={index} className="flex items-center bg-gray-50 p-3 rounded">
            <div className="flex-shrink-0 mr-3">
              {file.type && file.type.startsWith('image/') ? (
                <img 
                  src={`${window.location.origin}${file.path}`}
                  alt={file.originalName || 'File'}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    console.error("Image load error:", e);
                    e.target.src = "https://via.placeholder.com/48?text=Error";
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">DOC</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.originalName || file.filename}</p>
              <p className="text-xs text-gray-500">
                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
              </p>
            </div>
            <a 
              href={`${window.location.origin}${file.path}`}
              download={file.originalName || file.filename}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-4">No files uploaded</p>
    )}
  </div>
</div>
            
            {/* Messages */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Messages</h4>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                {selectedRequest.developerMessages && selectedRequest.developerMessages.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.developerMessages.map((message, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded">
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages yet</p>
                )}
              </div>
            </div>
            
            {/* Send Message Form */}
            {selectedRequest.status !== 'completed' && selectedRequest.status !== 'rejected' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message to the client..."
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px] resize-none"
                    ></textarea>
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {message.length} characters
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`px-4 py-2 rounded text-sm ${
                      !message.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          {selectedRequest.status === 'in_progress' && (
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={handleCompleteRequest}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Developer Assignment Modal
  const AssignDeveloperModal = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              Assign Developer to Update Request
            </h3>
            <button 
              onClick={() => {
                setIsAssignModalOpen(false);
                setSelectedDeveloper('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">Client: {selectedRequest.userId?.name}</p>
            <p className="text-gray-700 mb-4">Plan: {selectedRequest.updatePlanId?.productId?.serviceName}</p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Developer
            </label>
            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Select a Developer --</option>
              {developers
                .filter(dev => dev.status !== 'On Leave')
                .map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name} - {developer.department} ({developer.activeProjects?.length || 0}/{developer.workload?.maxProjects || 3} projects)
                  </option>
                ))}
            </select>

            {selectedDeveloper && (
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm text-blue-800">
                  The developer will be notified about this assignment.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedDeveloper('');
                  setIsDetailModalOpen(true);
                }}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDeveloper}
                disabled={!selectedDeveloper}
                className={`px-4 py-2 rounded ${
                  !selectedDeveloper 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Assign Developer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <TriangleMazeLoader />
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Website Update Requests</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {updateRequests.length > 0 ? (
          updateRequests.map((request) => (
            <div 
              key={request._id} 
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">Update Request</h3>
                  <p className="text-sm text-gray-600">Client: {request.userId?.name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Submitted: {formatDate(request.createdAt)}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>
              
              <div className="mb-4">
                <p className="text-sm">
                  <span className="text-gray-600">Plan:</span> {request.updatePlanId?.productId?.serviceName}
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Files:</span> {request.files ? request.files.length : 0}
                </p>
                {request.assignedDeveloper && (
                  <p className="text-sm text-blue-600 mt-1">
                    Developer: {request.assignedDeveloper.name}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDetailModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                
                {!request.assignedDeveloper && request.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsAssignModalOpen(true);
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assign
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No update requests found.
          </div>
        )}
      </div>
      
      {isDetailModalOpen && <RequestDetailModal />}
      {isAssignModalOpen && <AssignDeveloperModal />}
    </div>
  );
};

export default AdminUpdateRequests;