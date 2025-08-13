import React from 'react'
import { ChevronRight, Globe, Smartphone, Settings, Users, FileText, GraduationCap, Wrench, UserCheck,Zap, Shield, Award   } from 'lucide-react';

const WhatDoYouNeedSection = () => {
  return (
    <div>
      {/* What Do You Need - From 2nd Code */}
            <section className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">What Do You Need?</h2>
                  <p className="text-gray-600">Tell us your requirements and we'll build it</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Simple Website</h3>
                    <p className="text-gray-600 mb-4">Professional business website with modern design</p>
                    <div className="text-blue-600 font-medium group-hover:text-blue-700">Starting from ₹15,000</div>
                  </div>
      
                  <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Web Software</h3>
                    <p className="text-gray-600 mb-4">Custom business management systems</p>
                    <div className="text-purple-600 font-medium group-hover:text-purple-700">Starting from ₹50,000</div>
                  </div>
      
                  <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile App</h3>
                    <p className="text-gray-600 mb-4">Native iOS and Android applications</p>
                    <div className="text-pink-600 font-medium group-hover:text-pink-700">Starting from ₹1,00,000</div>
                  </div>
                </div>
              </div>
            </section>
    </div>
  )
}

export default WhatDoYouNeedSection;