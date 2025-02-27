import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Clock, Download, MessageCircle, CheckCircle, FileText } from 'lucide-react';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const DeveloperUpdatePanel = () => {
  const [assignedUpdates, setAssignedUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [developerNotes, setDeveloperNotes] = useState('');
  
  // Fetch assigned updates
  const fetchAssignedUpdates = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.developerAssignedUpdates.url, {
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        setAssignedUpdates(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch assigned updates');
      }
    } catch (error) {
      console.error('Error fetching assigned updates:', error);
      toast.error('Failed to fetch assigned updates');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAssignedUpdates();
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
  
  // Handle sending message to client
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    try {
      const response = await fetch(SummaryApi.developerUpdateMessage.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedUpdate._id,
          message: message.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Message sent successfully');
        
        // Update local state
        setSelectedUpdate({
          ...selectedUpdate,
          developerMessages: [
            ...(selectedUpdate.developerMessages || []),
            {
              message: message.trim(),
              timestamp: new Date()
            }
          ]
        });
        
        setMessage('');
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Handle adding developer notes (private)
  const handleAddNote = async () => {
    if (!developerNotes.trim()) {
      toast.error('Please enter a note');
      return;
    }
    
    try {
      const response = await fetch(SummaryApi.addDeveloperNote.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedUpdate._id,
          note: developerNotes.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Note added successfully');
        
        // Update local state
        setSelectedUpdate({
          ...selectedUpdate,
          developerNotes: [
            ...(selectedUpdate.developerNotes || []),
            {
              text: developerNotes.trim(),
              timestamp: new Date()
            }
          ]
        });
        
        setDeveloperNotes('');
      } else {
        toast.error(data.message || 'Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };
  
  // Handle marking update as completed
  const handleCompleteUpdate = async () => {
    try {
      const response = await fetch(SummaryApi.completeDeveloperUpdate.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedUpdate._id,
          completionMessage: message.trim() || 'Update completed successfully.'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Update marked as completed');
        
        // Update local state
        setSelectedUpdate({
          ...selectedUpdate,
          status: 'completed',
          completedAt: new Date(),
          developerMessages: message.trim() ? [
            ...(selectedUpdate.developerMessages || []),
            {
              message: message.trim(),
              timestamp: new Date()
            }
          ] : selectedUpdate.developerMessages
        });
        
        // Refresh the list
        fetchAssignedUpdates();
        
        // Close modal after a delay
        setTimeout(() => {
          setIsDetailModalOpen(false);
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to complete update');
      }
    } catch (error) {
      console.error('Error completing update:', error);
      toast.error('Failed to complete update');
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
  
  // Update Detail Modal
  const UpdateDetailModal = () => {
    if (!selectedUpdate) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Update Request Details</h3>
              <p className="text-sm text-gray-600">
                Assigned: {formatDate(selectedUpdate.assignedAt || selectedUpdate.createdAt)}
              </p>
            </div>
            <StatusBadge status={selectedUpdate.status} />
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
                <p><span className="text-gray-600">Name:</span> {selectedUpdate.userId?.name}</p>
                <p><span className="text-gray-600">Email:</span> {selectedUpdate.userId?.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Update Plan</h4>
                <p>
                  <span className="text-gray-600">Plan:</span> {selectedUpdate.updatePlanId?.productId?.serviceName}
                </p>
                <p>
                  <span className="text-gray-600">Status:</span> {selectedUpdate.status}
                </p>
              </div>
            </div>
            
            {/* Client Instructions */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Client Instructions</h4>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                {selectedUpdate.instructions && selectedUpdate.instructions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUpdate.instructions.map((instruction, index) => (
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
                {selectedUpdate.files && selectedUpdate.files.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUpdate.files.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-50 p-3 rounded">
                        <div className="flex-shrink-0 mr-3">
                          {file.type.startsWith('image/') ? (
                            <img 
                              src={file.path}
                              alt={file.originalName}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.originalName}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <a 
                          href={file.path}
                          download={file.originalName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No files uploaded</p>
                )}
              </div>
            </div>
            
            {/* Messages History */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Communication History</h4>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                {selectedUpdate.developerMessages && selectedUpdate.developerMessages.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUpdate.developerMessages.map((msg, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded">
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages yet</p>
                )}
              </div>
            </div>
            
            {/* Developer Private Notes */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Private Notes (only visible to developers)</h4>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto mb-2">
                {selectedUpdate.developerNotes && selectedUpdate.developerNotes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUpdate.developerNotes.map((note, index) => (
                      <div key={index} className="bg-yellow-50 p-3 rounded">
                        <p className="text-sm">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No notes yet</p>
                )}
              </div>
              
              {selectedUpdate.status !== 'completed' && selectedUpdate.status !== 'rejected' && (
                <div className="flex space-x-2">
                  <textarea
                    value={developerNotes}
                    onChange={(e) => setDeveloperNotes(e.target.value)}
                    placeholder="Add a private note (not visible to clients)..."
                    className="flex-1 p-2 border rounded min-h-[60px] resize-none"
                  ></textarea>
                  <button
                    onClick={handleAddNote}
                    disabled={!developerNotes.trim()}
                    className={`px-4 whitespace-nowrap self-end ${
                      !developerNotes.trim() 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    } rounded py-2`}
                  >
                    Add Note
                  </button>
                </div>
              )}
            </div>
            
            {/* Send Message to Client */}
            {selectedUpdate.status !== 'completed' && selectedUpdate.status !== 'rejected' && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Send Message to Client</h4>
                <div className="flex space-x-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 p-2 border rounded min-h-[80px] resize-none"
                  ></textarea>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`px-4 whitespace-nowrap self-end py-2 ${
                      !message.trim() 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } rounded`}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          {selectedUpdate.status !== 'completed' && selectedUpdate.status !== 'rejected' && (
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={handleCompleteUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
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
  
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <TriangleMazeLoader />
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">My Assigned Updates</h2>
      
      {assignedUpdates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 mb-2">You don't have any assigned updates at the moment.</p>
          <p className="text-gray-500">Check back later or contact the admin team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedUpdates.map(update => (
            <div 
              key={update._id} 
              className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">Website Update</h3>
                  <p className="text-sm text-gray-600">Client: {update.userId?.name}</p>
                </div>
                <StatusBadge status={update.status} />
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Assigned: {formatDate(update.assignedAt || update.createdAt)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Files: {update.files?.length || 0} • 
                  Messages: {update.developerMessages?.length || 0}
                </p>
              </div>
              
              {update.instructions && update.instructions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Latest Instruction:</p>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    {update.instructions[update.instructions.length - 1].text}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setSelectedUpdate(update);
                  setIsDetailModalOpen(true);
                  setMessage('');
                  setDeveloperNotes('');
                }}
                className="w-full mt-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      
      {isDetailModalOpen && <UpdateDetailModal />}
    </div>
  );
};

export default DeveloperUpdatePanel;