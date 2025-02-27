import React, { useState } from 'react';
import { X, Send, Upload, PlusCircle, MessageSquare, RefreshCw } from 'lucide-react';

// Main Dashboard Component
const WebsiteDevelopmentPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUpdatePortal, setShowUpdatePortal] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [instructionMessages, setInstructionMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  
  const handleSendInstruction = () => {
    if (currentMessage.trim() !== '') {
      setInstructionMessages([...instructionMessages, {
        text: currentMessage,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setCurrentMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendInstruction();
    }
  };
  
  const resetUpdatePortal = () => {
    setShowUpdatePortal(false);
    setInstructionMessages([]);
    setUploadedImages([]);
    setUploadedDocuments([]);
  };
  
  // Mock file upload functions
  const handleImageUpload = () => {
    const mockImages = [
      { name: 'banner.jpg', size: '1.2 MB' },
      { name: 'product-image.jpg', size: '850 KB' }
    ];
    setUploadedImages([...uploadedImages, ...mockImages]);
  };
  
  const handleDocumentUpload = () => {
    const mockDocs = [
      { name: 'specifications.txt', size: '45 KB' },
      { name: 'content-updates.rtf', size: '120 KB' }
    ];
    setUploadedDocuments([...uploadedDocuments, ...mockDocs]);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Website Development Portal</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'projects' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('projects')}
            >
              My Projects
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Project Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <h3 className="text-xl font-medium">My E-commerce Website</h3>
              <p className="text-gray-600 mt-2">Last updated: 1 day ago</p>
              <div className="mt-4 flex justify-between">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                  onClick={() => setShowUpdatePortal(true)}
                >
                  <RefreshCw size={16} />
                  <span>Request Update</span>
                </button>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                  onClick={() => setShowChatWindow(true)}
                >
                  <MessageSquare size={16} />
                  <span>Ask Developer</span>
                </button>
              </div>
            </div>
            
            {/* Add New Project Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition cursor-pointer">
              <PlusCircle size={40} />
              <p className="mt-2 font-medium">Add New Project</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Update Request Portal */}
      {showUpdatePortal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Request Website Update</h2>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={resetUpdatePortal}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel - File Uploads */}
              <div className="w-full md:w-1/2 p-4 border-r overflow-y-auto">
                <h3 className="text-lg font-medium mb-3">Upload Resources</h3>
                
                {/* Images Upload */}
                <div className="mb-4 border border-gray-300 rounded-lg p-4">
                  <h4 className="text-md font-medium mb-2">Images (JPG only)</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto text-gray-400" size={24} />
                    <p className="mt-2 text-sm text-gray-500">Drag and drop image files here, or click to browse</p>
                    <p className="mt-1 text-xs text-gray-400">Supports JPG format only</p>
                    <button 
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      onClick={handleImageUpload}
                    >
                      Browse Files
                    </button>
                  </div>
                  
                  {/* Uploaded Images List */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Uploaded Images:</h5>
                      <ul className="space-y-1">
                        {uploadedImages.map((file, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-50 rounded p-2 text-sm">
                            <span>{file.name}</span>
                            <span className="text-gray-500">{file.size}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Documents Upload */}
                <div className="mb-4 border border-gray-300 rounded-lg p-4">
                  <h4 className="text-md font-medium mb-2">Documents (TXT or RTF only)</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto text-gray-400" size={24} />
                    <p className="mt-2 text-sm text-gray-500">Drag and drop document files here, or click to browse</p>
                    <p className="mt-1 text-xs text-gray-400">Supports TXT and RTF formats only</p>
                    <button 
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      onClick={handleDocumentUpload}
                    >
                      Browse Files
                    </button>
                  </div>
                  
                  {/* Uploaded Documents List */}
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Uploaded Documents:</h5>
                      <ul className="space-y-1">
                        {uploadedDocuments.map((file, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-50 rounded p-2 text-sm">
                            <span>{file.name}</span>
                            <span className="text-gray-500">{file.size}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Panel - Instructions Chat-like Interface */}
              <div className="w-full md:w-1/2 flex flex-col h-full">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium">Provide Instructions</h3>
                  <p className="text-sm text-gray-500">Send specific instructions for your website update</p>
                </div>
                
                {/* Instructions Messages Area */}
                <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
                  {instructionMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-center">
                        No instructions provided yet.<br />
                        Use the field below to send your update instructions.
                      </p>
                    </div>
                  ) : (
                    instructionMessages.map((msg, index) => (
                      <div key={index} className="flex justify-end">
                        <div className="bg-blue-500 text-white rounded-lg shadow p-3 max-w-xs md:max-w-md">
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-blue-200 mt-1 text-right">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Instructions Input */}
                <div className="p-3 bg-white border-t">
                  <div className="flex items-center space-x-2">
                    <textarea 
                      className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Type your instructions here..."
                      rows="3"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                    ></textarea>
                    <button 
                      className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 self-end"
                      onClick={handleSendInstruction}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end space-x-3 bg-gray-50">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={resetUpdatePortal}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                disabled={uploadedImages.length === 0 && uploadedDocuments.length === 0 && instructionMessages.length === 0}
              >
                <span>Agree and Initiate Update</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Window */}
      {showChatWindow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 max-h-screen flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  SD
                </div>
                <div>
                  <h2 className="font-medium">Chat with Developer</h2>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowChatWindow(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
              {/* Chat Messages */}
              <div className="flex justify-start">
                <div className="bg-white rounded-lg shadow p-3 max-w-xs md:max-w-md">
                  <p className="text-sm">Hello! I'm your assigned developer. How can I assist you with your website today?</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">10:05 AM</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg shadow p-3 max-w-xs md:max-w-md">
                  <p className="text-sm">Hi, I wanted to ask about adding a new payment gateway to my e-commerce site.</p>
                  <p className="text-xs text-blue-200 mt-1 text-right">10:08 AM</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-white rounded-lg shadow p-3 max-w-xs md:max-w-md">
                  <p className="text-sm">That's a great addition! We can implement various payment gateways like PayPal, Stripe, or Razorpay. Do you have a specific one in mind?</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">10:10 AM</p>
                </div>
              </div>
            </div>
            
            <div className="border-t p-3 bg-white">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Type your message here..."
                />
                <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteDevelopmentPortal;