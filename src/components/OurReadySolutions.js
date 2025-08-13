import React from 'react'
import { ChevronRight, Globe, Smartphone, Settings, Users, FileText, GraduationCap, Wrench, UserCheck,Zap, Shield, Award   } from 'lucide-react';

const OurReadySolutions = () => {
  return (
    <div>
      {/* Portfolio Solutions */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Ready Solutions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {/* Complaint Management */}
            <div className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complaint Management System</h3>
              <p className="text-gray-600 mb-4">Complete staff and branch management for service-based companies</p>
              <div className="flex items-center text-blue-600 font-semibold">
                View Details <ChevronRight className="ml-2 w-4 h-4" />
              </div>
            </div>

            {/* Service Registration */}
            <div className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Service Registration Management</h3>
              <p className="text-gray-600 mb-4">Track product registration and service requests efficiently</p>
              <div className="flex items-center text-green-600 font-semibold">
                View Details <ChevronRight className="ml-2 w-4 h-4" />
              </div>
            </div>

            {/* Partner Management */}
            <div className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Service Partner Management</h3>
              <p className="text-gray-600 mb-4">Manage local service partners for installations and support</p>
              <div className="flex items-center text-purple-600 font-semibold">
                View Details <ChevronRight className="ml-2 w-4 h-4" />
              </div>
            </div>

            {/* Educational Websites */}
            <div className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Websites & Updates</h3>
              <p className="text-gray-600 mb-4">College and institute portfolios with regular update plans</p>
              <div className="flex items-center text-orange-600 font-semibold">
                View Details <ChevronRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurReadySolutions;
