import React from 'react'
import { ChevronRight, Globe, Smartphone, Settings, Users, FileText, GraduationCap, Wrench, UserCheck,Zap, Shield, Award   } from 'lucide-react';

const WhyChooseSection = () => {
  return (
    <div>
       {/* Why Choose Us - Clickable Cards */}
                 <section className="bg-gradient-to-br from-slate-900 to-gray-900 text-white py-16">
                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <h2 className="text-3xl font-bold text-center mb-12">Why Choose MeraSoftware?</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                       
                       <div className="text-center cursor-pointer hover:bg-cyan-600 hover:bg-opacity-20 p-6 rounded-xl transition-all group">
                         <div className="bg-cyan-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Zap className="w-8 h-8 text-cyan-400" />
                         </div>
                         <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors">100% Coding Based</h3>
                         <p className="text-gray-300 text-sm mb-3">We write custom code, no website builders or templates</p>
                         <ChevronRight className="w-4 h-4 text-cyan-400 mx-auto group-hover:translate-x-1 transition-transform" />
                       </div>
           
                       <div className="text-center cursor-pointer hover:bg-cyan-600 hover:bg-opacity-20 p-6 rounded-xl transition-all group">
                         <div className="bg-cyan-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Award className="w-8 h-8 text-cyan-400" />
                         </div>
                         <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors">Exclusive Solutions</h3>
                         <p className="text-gray-300 text-sm mb-3">Every project is unique and tailored to your business</p>
                         <ChevronRight className="w-4 h-4 text-cyan-400 mx-auto group-hover:translate-x-1 transition-transform" />
                       </div>
           
                       <div className="text-center cursor-pointer hover:bg-cyan-600 hover:bg-opacity-20 p-6 rounded-xl transition-all group">
                         <div className="bg-cyan-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Shield className="w-8 h-8 text-cyan-400" />
                         </div>
                         <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors">Quote Based Work</h3>
                         <p className="text-gray-300 text-sm mb-3">We understand your needs and provide custom solutions</p>
                         <ChevronRight className="w-4 h-4 text-cyan-400 mx-auto group-hover:translate-x-1 transition-transform" />
                       </div>
           
                       <div className="text-center cursor-pointer hover:bg-cyan-600 hover:bg-opacity-20 p-6 rounded-xl transition-all group">
                         <div className="bg-cyan-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Users className="w-8 h-8 text-cyan-400" />
                         </div>
                         <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors">Expert Team</h3>
                         <p className="text-gray-300 text-sm mb-3">Experienced developers and designers</p>
                         <ChevronRight className="w-4 h-4 text-cyan-400 mx-auto group-hover:translate-x-1 transition-transform" />
                       </div>
                     </div>
                   </div>
                 </section>
    </div>
  )
}

export default WhyChooseSection
