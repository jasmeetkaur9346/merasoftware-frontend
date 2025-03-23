import React from 'react';
import { LogOut, Package, Camera, Edit, User, Mail, Phone, Calendar, Settings, Bell, Shield, MessageSquare } from 'lucide-react';

const ProfileSettings = () => {
  const profileData = {
    fullName: 'sandeep singh',
    email: 'singhsandeep178@gmail.com',
    phone: '9256537003',
    age: '40'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-4xl">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Side - Profile Image and Basic Info */}
        <div className="p-6 flex flex-col items-center border-r border-gray-200 md:w-1/3">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              <img 
                src="/api/placeholder/150/150" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-3 right-0 bg-blue-500 text-white p-2 rounded-full">
              <Camera size={20} />
            </button>
          </div>
          <h2 className="text-xl font-semibold">sandeep singh</h2>
          <p className="text-gray-500">{profileData.email}</p>

          {/* Quick Links Section */}
          <div className="mt-6 w-full">
            <h3 className="text-lg font-medium mb-3">Quick Links</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {/* Your Orders Quick Link */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded">
                <div className="flex items-center">
                  <Package size={18} className="text-blue-500 mr-2" />
                  <span>Your Orders</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
              
              {/* Contact Support Quick Link */}
              <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded">
                <div className="flex items-center">
                  <MessageSquare size={18} className="text-blue-500 mr-2" />
                  <span>Contact Support</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <button className="mt-6 flex items-center justify-center w-full py-2 px-4 text-red-500 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
            <LogOut size={18} className="mr-2" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Side - Settings */}
        <div className="p-6 md:w-2/3">
          {/* Personal Information */}
          <div className="mb-8">
            <div className="flex items-center text-lg font-medium mb-4">
              <User size={20} className="text-blue-500 mr-2" />
              <h2>Personal Information</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <User size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">Full Name</span>
                  </div>
                  <p>{profileData.fullName}</p>
                </div>
                <Edit size={18} className="text-blue-500 cursor-pointer" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">Email Address</span>
                  </div>
                  <p>{profileData.email}</p>
                </div>
                <Edit size={18} className="text-blue-500 cursor-pointer" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <Phone size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">Phone Number</span>
                  </div>
                  <p>{profileData.phone}</p>
                </div>
                <Edit size={18} className="text-blue-500 cursor-pointer" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">Age</span>
                  </div>
                  <p>{profileData.age}</p>
                </div>
                <Edit size={18} className="text-blue-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mb-6">
            <div className="flex items-center text-lg font-medium mb-4">
              <Settings size={20} className="text-blue-500 mr-2" />
              <h2>Account Settings</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Settings size={18} className="text-blue-500 mr-3" />
                <span>Account Preferences</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Shield size={18} className="text-blue-500 mr-3" />
                <span>Privacy & Security</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Bell size={18} className="text-blue-500 mr-3" />
                <span>Notification Settings</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;