import React, { useState } from 'react';
import { User, Camera, LogOut, Edit, ChevronRight, Settings, Mail, Phone, Calendar } from 'lucide-react';

const ProfileSettings = () => {
  const [user, setUser] = useState({
    name: 'Sandeep Singh',
    email: 'singhsandeep178@gmail.com',
    phone: '9256537003',
    age: 38,
    profilePic: null // Default no profile picture
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with title */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">Profile Settings</h1>
          </div>
          
          <div className="md:flex">
            {/* Left sidebar with profile picture */}
            <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="profile-pic-upload" 
                  className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-3 cursor-pointer shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Camera size={20} className="text-white" />
                  <input 
                    type="file" 
                    id="profile-pic-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 mb-6">{user.email}</p>
              
              {/* Logout button in sidebar */}
              <button className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
            
            {/* Right content area */}
            <div className="md:w-2/3 p-6">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <User size={20} className="text-blue-500" />
                    Personal Information
                  </h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <User className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">Full Name</p>
                        </div>
                      </div>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                        <Edit size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Mail className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.email}</p>
                          <p className="text-xs text-gray-500">Email Address</p>
                        </div>
                      </div>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                        <Edit size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Phone className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.phone}</p>
                          <p className="text-xs text-gray-500">Phone Number</p>
                        </div>
                      </div>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                        <Edit size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.age}</p>
                          <p className="text-xs text-gray-500">Age</p>
                        </div>
                      </div>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Account Settings Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-blue-500" />
                    Account Settings
                  </h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-full">
                          <Settings size={16} />
                        </div>
                        <span className="text-sm font-medium">Account Preferences</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-full">
                          <span className="text-base">🔒</span>
                        </div>
                        <span className="text-sm font-medium">Privacy & Security</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-500 rounded-full">
                          <span className="text-base">📱</span>
                        </div>
                        <span className="text-sm font-medium">Notification Settings</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;