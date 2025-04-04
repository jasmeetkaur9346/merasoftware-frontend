import React, { useState, useEffect, useRef } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [projectLink, setProjectLink] = useState('');
  
  // Add refs for the inputs
  // const projectLinkInputRef = useRef(null);
  const messageTextareaRef = useRef(null);
  const projectLinkRef = useRef(null);

  // Fetch all website projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(SummaryApi.adminProjects.url, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if(data.success) {
        setProjects(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all developers
  const fetchDevelopers = async () => {
    try {
      const response = await fetch(SummaryApi.allDevelopers.url, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if(data.success) {
        setDevelopers(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch developers');
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  // Function to open edit modal
  const openEditModal = (project) => {
    setSelectedProject(project);
    setProjectLink(project.projectLink || '');
    setSelectedCheckpoint(null);
    setMessage('');
    setEditingMessageId(null);
    setIsModalOpen(true);
  };

  // Handle sending update and message
  const handleSendUpdate = async (projectId, projectLink) => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
  
    try {
      // Update project link if it has changed
      if (projectLink !== selectedProject.projectLink) {
        const linkUpdateResponse = await fetch(SummaryApi.updateProjectLink.url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            projectId,
            projectLink
          })
        });
  
        const linkUpdateData = await linkUpdateResponse.json();
        if (!linkUpdateData.success) {
          toast.error(linkUpdateData.message || 'Failed to update project link');
          // Continue with the rest of the updates even if link update fails
        }
      }
  
      // If a checkpoint is selected, update progress first
      if (selectedCheckpoint) {
        const progressResponse = await fetch(SummaryApi.updateProjectProgress.url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            projectId,
            checkpointId: selectedCheckpoint.checkpointId,
            name: selectedCheckpoint.name,
            completed: true
          })
        });
  
        const progressData = await progressResponse.json();
        if (!progressData.success) {
          toast.error(progressData.message || 'Failed to update progress');
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
          projectId,
          message: message.trim(),
          messageId: editingMessageId,
          isEdit: Boolean(editingMessageId),
          checkpointId: selectedCheckpoint ? selectedCheckpoint.checkpointId : null,
          checkpointName: selectedCheckpoint ? selectedCheckpoint.name : null
        })
      });
  
      const messageData = await messageResponse.json();
      
      if(messageData.success) {
        toast.success('Update sent successfully');
        setMessage('');
        setSelectedCheckpoint(null);
        setEditingMessageId(null);
        setProjectLink('');
        setIsModalOpen(false);
        fetchProjects();
      } else {
        toast.error(messageData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send update');
    }
  };

  // Handle project link change
  const handleProjectLinkChange = (e) => {
    setProjectLink(e.target.value);
  };

  // Handle message change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle assigning developer to project
  const handleAssignDeveloper = async () => {
    if (!selectedDeveloper) {
      toast.error('Please select a developer');
      return;
    }

    try {
      const response = await fetch(SummaryApi.assignDeveloper.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: selectedProject._id,
          developerId: selectedDeveloper
        })
      });

      const data = await response.json();
      
      if(data.success) {
        toast.success('Developer assigned successfully! Notifications have been sent to both client and developer.');
        setIsAssignModalOpen(false);
        setSelectedDeveloper('');
        fetchProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign developer');
    }
  };

  // Find the next available checkpoint
  const getNextCheckpoint = (checkpoints) => {
    for (let i = 0; i < checkpoints.length; i++) {
      if (!checkpoints[i].completed) {
        return i;
      }
    }
    return checkpoints.length; // All completed
  };

  const ProjectCard = ({ project }) => (
    <div className="w-80 bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg">{project.productId?.serviceName}</h3>
          <p className="text-sm text-gray-600">Client: {project.userId?.name}</p>
          <p className="text-sm text-gray-600">
            Ordered: {new Date(project.createdAt).toLocaleDateString()}
          </p>
          {project.assignedDeveloper && (
            <p className="text-sm text-blue-600">
              Developer: {typeof project.assignedDeveloper === 'object' 
                ? project.assignedDeveloper.name 
                : 'Assigned'}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedProject(project);
              setIsAssignModalOpen(true);
            }}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            {project.assignedDeveloper ? 'Reassign' : 'Assign'}
          </button>
          <button
            onClick={() => openEditModal(project)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(project.projectProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.round(project.projectProgress)}%` }}
          ></div>
        </div>
      </div>

      {/* Preview latest message */}
      {project.messages && project.messages.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 border-t pt-3">
          <p className="font-medium">Latest Update:</p>
          <p className="mt-1">{project.messages[project.messages.length - 1].message}</p>
        </div>
      )}
    </div>
  );

  const EditModal = () => {
      // यहां हम नए state variables जोड़ेंगे
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
    if (!selectedProject) return null;
    

  // लिंक बटन को मैसेज में जोड़ने का फंक्शन
  const addLinkToMessage = () => {
    if (!linkText.trim() || !linkUrl.trim()) {
      toast.error('Please enter both button text and URL');
      return;
    }
    
    // लिंक को एक विशेष फॉर्मेट में जोड़ें: [[TEXT||URL]]
    const linkMarkup = `[[${linkText}||${linkUrl}]]`;
    
    // मैसेज में इस लिंक मार्कअप को जोड़ें
    setMessage(prevMessage => prevMessage + ' ' + linkMarkup);
    
    // फॉर्म को रीसेट करें
    setLinkText('');
    setLinkUrl('');
    setShowLinkForm(false);
    
    // फोकस को वापस मैसेज टेक्स्टएरिया पर करें
    setTimeout(() => {
      if (messageTextareaRef.current) {
        messageTextareaRef.current.focus();
      }
    }, 0);
  };

    const nextCheckpointIndex = getNextCheckpoint(selectedProject.checkpoints);
      
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              Edit Project: {selectedProject.productId?.serviceName}
            </h3>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCheckpoint(null);
                setMessage('');
                setEditingMessageId(null);
                setProjectLink(''); 
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
  
          {/* Project Details */}
          <div className="mb-6">
            <p className="text-gray-600">Client: {selectedProject.userId?.name}</p>
            <p className="text-gray-600">
              Ordered: {new Date(selectedProject.createdAt).toLocaleDateString()}
            </p>
            {selectedProject.assignedDeveloper && (
              <p className="text-blue-600">
                Developer: {typeof selectedProject.assignedDeveloper === 'object' 
                  ? selectedProject.assignedDeveloper.name 
                  : 'Assigned'}
              </p>
            )}
          </div>
  
          {/* Project Link Field - NEW */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Project Link <span className="text-gray-500 text-xs">(Visible to client)</span>
            </label>
            <input
  ref={projectLinkRef}
  type="text"
  value={projectLink}
  onChange={(e) => {
    setProjectLink(e.target.value);
    // Force focus to stay on this input after the state update
    setTimeout(() => {
      if (projectLinkRef.current) {
        projectLinkRef.current.focus();
        // Keep cursor at the end
        const length = e.target.value.length;
        projectLinkRef.current.setSelectionRange(length, length);
      }
    }, 0);
  }}
  placeholder="https://example.com/project"
  className="w-full p-2 border rounded text-sm focus:outline-none focus:border-blue-500"
/>
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL where the client can view their completed project
            </p>
          </div>
  
          {/* Progress Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Update Progress
            </label>
            <select
              value={selectedCheckpoint ? selectedProject.checkpoints.findIndex(cp => cp.checkpointId === selectedCheckpoint.checkpointId) : ''}
              onChange={(e) => {
                const selectedIndex = parseInt(e.target.value);
                if (selectedIndex >= 0) {
                  setSelectedCheckpoint(selectedProject.checkpoints[selectedIndex]);
                } else {
                  setSelectedCheckpoint(null);
                }
              }}
              className="w-full p-2 border rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select checkpoint (optional)...</option>
              {selectedProject.checkpoints.map((checkpoint, index) => (
                <option 
                  key={checkpoint.checkpointId} 
                  value={index}
                  disabled={index !== nextCheckpointIndex}
                >
                  {checkpoint.name} ({checkpoint.percentage}%) {checkpoint.completed ? '(Completed)' : ''}
                </option>
              ))}
            </select>
          </div>
  
          {/* Completed Checkpoints */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Completed Steps</h4>
            <div className="space-y-1">
              {selectedProject.checkpoints
                .filter(checkpoint => checkpoint.completed)
                .map((checkpoint) => (
                  <div 
                    key={checkpoint.checkpointId}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <span className="text-green-500 mr-2">✓</span>
                    {checkpoint.name}
                  </div>
                ))}
            </div>
          </div>
  
          {/* Previous Messages */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Previous Updates</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedProject.messages && selectedProject.messages.map((msg, index) => (
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
            {selectedCheckpoint && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                Updating progress to: {selectedCheckpoint.name}
              </div>
            )}
            {editingMessageId && (
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

            {/* Link Button Form */}
          {showLinkForm && (
            <div className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Add Link Button</h4>
                <button 
                  onClick={() => setShowLinkForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Button Text (e.g. Access Your Software)"
                  className="w-full p-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="URL (e.g. https://example.com)"
                  className="w-full p-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowLinkForm(false)}
                    className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addLinkToMessage}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Link
                  </button>
                </div>
              </div>
            </div>
          )}

            <div className="flex gap-2">
              <div className="flex-1 relative">
              <textarea
  ref={messageTextareaRef}
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);
    // Force focus to stay on this textarea after the state update
    setTimeout(() => {
      if (messageTextareaRef.current) {
        messageTextareaRef.current.focus();
        // Keep cursor at the end
        const length = e.target.value.length;
        messageTextareaRef.current.setSelectionRange(length, length);
      }
    }, 0);
  }}
  onKeyDown={(e) => {
    // Prevent losing focus on Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setMessage(
        message.substring(0, start) + '    ' + message.substring(end)
      );
      // Move cursor after tab
      setTimeout(() => {
        if (messageTextareaRef.current) {
          messageTextareaRef.current.setSelectionRange(start + 4, start + 4);
        }
      }, 0);
    }
  }}
  placeholder={selectedCheckpoint ? "Message is required for progress update..." : "Send update to client..."}
  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px] resize-none"
/>
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {message.length} characters
                </div>
              </div>
               <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleSendUpdate(selectedProject._id, projectLink)}
                disabled={selectedCheckpoint && !message.trim()}
                className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
                  selectedCheckpoint && !message.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {editingMessageId ? 'Save Changes' : 'Send'}
              </button>
              
              {/* Add Link Button */}
              <button
                onClick={() => setShowLinkForm(true)}
                className="px-4 py-2 rounded text-sm whitespace-nowrap bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Add Link
              </button>
            </div>
          </div>
          
          {/* Preview section to show how links will appear */}
          {message.includes('[[') && message.includes('||') && message.includes(']]') && (
            <div className="mt-3 bg-gray-50 p-3 rounded border">
              <p className="text-xs font-medium mb-2">Preview:</p>
              <div className="text-sm" dangerouslySetInnerHTML={{ 
                __html: message.replace(
                  /\[\[(.+?)\|\|(.+?)\]\]/g, 
                  '<span class="text-blue-600 cursor-pointer px-2 py-1 bg-blue-100 rounded">👉 $1</span>'
                ) 
              }} />
              <p className="text-xs text-gray-500 mt-2">
                Links will appear as buttons in the client's email
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  const AssignDeveloperModal = () => {
    if (!selectedProject) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              Assign Developer to Project
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
            <p className="text-gray-700 mb-2">Project: {selectedProject.productId?.serviceName}</p>
            <p className="text-gray-700 mb-4">Client: {selectedProject.userId?.name}</p>
            
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
                    {developer.name} - {developer.department} ({developer.activeProjects.length}/{developer.workload.maxProjects} projects)
                  </option>
                ))}
            </select>

            {selectedDeveloper && (
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm text-blue-800">
                  {selectedProject.assignedDeveloper ? 
                    'This will reassign the project to a new developer.' : 
                    'The developer will be notified about this assignment.'}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedDeveloper('');
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
                {selectedProject.assignedDeveloper ? 'Reassign' : 'Assign'} Developer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Website Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {isModalOpen && <EditModal />}
      {isAssignModalOpen && <AssignDeveloperModal />}
    </div>
  );
};

export default AdminProjects;