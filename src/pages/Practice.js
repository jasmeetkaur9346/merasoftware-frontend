import React, { useState, useRef } from 'react';
import { ChevronRight, Globe, Smartphone, Settings, Users, Wrench, UserCheck, Zap, Shield, Award, Search, Code, Home } from 'lucide-react';

export default function MeraSoftwareHomepage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const menuItems = [
    { 
      name: 'Home', 
      href: '#',
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: 'Services', 
      dropdown: [
        { 
          category: 'Development Services',
          items: [
            { name: 'Website Development', href: '#', desc: 'Custom Website Plans for Your Business' },
            { name: 'Mobile App Development', href: '#', desc: 'iOS & Android App Development' },
            { name: 'Cloud Software Development', href: '#', desc: 'Software to Automate Your Business' },
            { name: 'Feature Upgrades', href: '#', desc: 'Add Features to Existing Projects' }
          ]
        },
        {
          category: 'Website Types',
          items: [
            { name: 'College Website', href: '#' },
            { name: 'Educational Website', href: '#' },
            { name: 'Local Service Website', href: '#' },
            { name: 'Portfolio Website', href: '#' },
            { name: 'Restaurant Website', href: '#' }
          ]
        }
      ]
    },
    { 
      name: 'Solutions', 
      dropdown: [
        { 
          category: 'Business Solutions',
          items: [
            { name: 'Small Business', href: '#' },
            { name: 'Enterprise', href: '#' },
            { name: 'Startups', href: '#' },
            { name: 'Non-Profit', href: '#' }
          ]
        },
        {
          category: 'Industry Solutions',
          items: [
            { name: 'Education', href: '#' },
            { name: 'Healthcare', href: '#' },
            { name: 'Retail', href: '#' },
            { name: 'Real Estate', href: '#' }
          ]
        }
      ]
    },
    { 
      name: 'Resources', 
      dropdown: [
        {
          category: 'Learn & Support',
          items: [
            { name: 'Blog', href: '#' },
            { name: 'Documentation', href: '#' },
            { name: 'Tutorials', href: '#' },
            { name: 'Case Studies', href: '#' },
            { name: 'FAQ', href: '#' }
          ]
        },
        {
          category: 'Tools',
          items: [
            { name: 'Website Builder', href: '#' },
            { name: 'Domain Checker', href: '#' },
            { name: 'SEO Tools', href: '#' }
          ]
        }
      ]
    },
    { 
      name: 'Company', 
      dropdown: [
        {
          category: 'About',
          items: [
            { name: 'About Us', href: '#' },
            { name: 'Our Team', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Press & Media', href: '#' }
          ]
        },
        {
          category: 'Legal',
          items: [
            { name: 'Terms & Conditions', href: '#' },
            { name: 'Privacy Policy', href: '#' },
            { name: 'Cookie Policy', href: '#' }
          ]
        }
      ]
    },
    { 
      name: 'Contact', 
      href: '#' 
    }
  ];

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 1000);
  };

  const handleDashboardSwitch = () => {
    console.log('Switching to dashboard...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
       {/* Header */}
       <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                M
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">MeraSoftware</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {menuItems.map((item, index) => (
                <div 
                  key={index} 
                  className="relative group" 
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <a href={item.href} className="text-gray-700 hover:text-emerald-600 flex items-center">
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.name}
                    </a>
                  ) : (
                    <button
                      className="text-gray-700 hover:text-emerald-600 flex items-center focus:outline-none"
                    >
                      {item.name}
                      <ChevronRight className={`ml-1 w-4 h-4 transform ${activeDropdown === index ? 'rotate-90' : ''} transition-transform`} />
                    </button>
                  )}

                  {item.dropdown && activeDropdown === index && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-max bg-white rounded-lg shadow-xl p-6 grid grid-cols-2 gap-x-8 gap-y-4 z-50">
                      {item.dropdown.map((category, catIndex) => (
                        <div key={catIndex}>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">{category.category}</h4>
                          <ul className="space-y-2">
                            {category.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <a href={subItem.href} className="block text-gray-800 hover:text-emerald-600 text-sm font-medium">
                                  {subItem.name}
                                  {subItem.desc && <p className="text-gray-500 text-xs mt-0.5">{subItem.desc}</p>}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Section - Buttons */}
            <div className="flex space-x-3">
              <button className="bg-white text-cyan-600 border border-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-50 transition-colors">
                Staff Login
              </button>
              <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
        </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden bg-white shadow-lg py-4 px-4 sm:px-6">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.href ? (
                  <a href={item.href} className="block text-gray-700 hover:text-emerald-600 py-2 px-3 rounded-lg flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </a>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                      className="w-full text-left text-gray-700 hover:text-emerald-600 py-2 px-3 rounded-lg flex items-center justify-between"
                    >
                      {item.name}
                      <ChevronRight className={`w-4 h-4 transform ${activeDropdown === index ? 'rotate-90' : ''} transition-transform`} />
                    </button>
                    {activeDropdown === index && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((category, catIndex) => (
                          <div key={catIndex}>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">{category.category}</h4>
                            <ul className="space-y-1">
                              {category.items.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <a href={subItem.href} className="block text-gray-800 hover:text-emerald-600 text-sm py-1 px-2 rounded-md">
                                    {subItem.name}
                                    {subItem.desc && <p className="text-gray-500 text-xs mt-0.5">{subItem.desc}</p>}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Hero Section with Image */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Professional Software 
                <span className="text-cyan-600"> Solutions</span> for Your Business
              </h1>
              <p className="text-xl text-gray-600 mt-6">
                Custom-built software, websites, and mobile apps designed specifically for your business needs.
              </p>
              <button className="mt-8 bg-gradient-to-br from-cyan-800 to-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-semibold bg-gradient-to-br from-cyan-500 hover:to-cyan-900 flex items-center transition-colors">
                Get Started <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full w-96 h-96 mx-auto flex items-center justify-center shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Software Development" 
                  className="w-80 h-80 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - From 1st Code with Slightly Larger Boxes */}
            <section className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                  <p className="text-gray-600">Choose the perfect solution for your business</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-blue-600 to-blue-900 p-8 rounded-2xl text-white cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
                    <Globe className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold mb-2">Website Development</h3>
                    <p className="text-white text-sm mb-4">Custom responsive websites</p>
                    <ChevronRight className={`w-5 h-5 text-white group-hover:translate-x-1 transition-transform`} />
                  </div>
      
                  <div className="group bg-gradient-to-br from-purple-600 to-purple-900 p-8 rounded-2xl text-white cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
                    <Settings className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold mb-2">Web Software</h3>
                    <p className="text-white text-sm mb-4">Business management systems</p>
                    <ChevronRight className={`w-5 h-5 text-white group-hover:translate-x-1 transition-transform`} />
                  </div>
      
                  <div className="group bg-gradient-to-br from-teal-600 to-teal-900 p-8 rounded-2xl text-white cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
                    <Smartphone className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold mb-2">Mobile Apps</h3>
                    <p className="text-white text-sm mb-4">Native mobile applications</p>
                    <ChevronRight className={`w-5 h-5 text-white group-hover:translate-x-1 transition-transform`} />
                  </div>
      
                  <div className="group bg-gradient-to-br from-cyan-600 to-cyan-900 p-8 rounded-2xl text-white cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1">
                    <Wrench className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold mb-2">Support Services</h3>
                    <p className="text-white text-sm mb-4">Updates & maintenance</p>
                    <ChevronRight className={`w-5 h-5 text-white group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </div>
            </section>

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

      {/* What Do You Need - From 2nd Code */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Do You Need?</h2>
              <p className="text-gray-600">Tell us your requirements and we'll build it</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-gradient-to-r from-blue-500 to-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Simple Website</h3>
                <p className="text-gray-600 mb-4">Professional business website with modern design</p>
                <div className="text-blue-600 font-medium group-hover:text-blue-700">Starting from ₹15,000</div>
              </div>
  
              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-gradient-to-r from-purple-500 to-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Web Software</h3>
                <p className="text-gray-600 mb-4">Custom business management systems</p>
                <div className="text-purple-600 font-medium group-hover:text-purple-700">Starting from ₹50,000</div>
              </div>
  
              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-gradient-to-r from-teal-500 to-teal-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile App</h3>
                <p className="text-gray-600 mb-4">Native iOS and Android applications</p>
                <div className="text-teal-600 font-medium group-hover:text-teal-700">Starting from ₹1,00,000</div>
              </div>

               <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Promote Business on Google</h3>
                <p className="text-gray-600 mb-4">SEO optimization and Google business promotion</p>
                <div className="text-cyan-600 font-medium group-hover:text-cyan-700">Starting from ₹15,000</div>
              </div>
  
              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-gradient-to-r from-pink-500 to-pink-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hire a Developer</h3>
                <p className="text-gray-600 mb-4">Dedicated developers for your project needs</p>
                <div className="text-pink-600 font-medium group-hover:text-pink-700">Starting from ₹30,000</div>
              </div>
  
              <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Update Your Website/App</h3>
                <p className="text-gray-600 mb-4">Maintenance and updates for existing projects</p>
                <div className="text-indigo-600 font-medium group-hover:text-indigo-700">Starting from ₹5,000</div>
              </div>
            </div>
          </div>
        </section>

{/* Business Software Solutions */}
<section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Business Software Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {/* Purchase once, own forever. Professional software that grows with your business */}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* CRM & Complaint Management */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                CRM & Complaint Management
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Complete customer relationship and complaint tracking system with multi-level escalation
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Customer service teams & call centers</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>E-commerce & telecom companies</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Automated escalation system</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center group-hover:shadow-lg">
                Learn More
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Service & Sales Management */}
          <div className="group relative bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-cyan-200 hover:border-cyan-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-cyan-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="bg-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Service & Sales Management
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Complete service booking and sales tracking platform with customer portal integration
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Service businesses & repair shops</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Salons, clinics & beauty parlors</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Online booking & payment portal</span>
                </div>
              </div>
              
              <button className="w-full bg-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-cyan-900 transition-colors flex items-center justify-center group-hover:shadow-lg">
                Learn More
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Partner & Sales Management */}
          <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-200 hover:border-purple-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Partner & Sales Management
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive partner network and sales tracking with territory management analytics
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Dealer networks & franchises</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Electronics & FMCG companies</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Performance analytics & commissions</span>
                </div>
              </div>
              
              <button className="w-full bg-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center group-hover:shadow-lg">
                Learn More
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-green-50 border border-green-600 text-green-800 px-6 py-3 rounded-full font-semibold">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Now available with flexible payment—once paid, the software is fully yours for life.
          </div>
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                M
              </div>
              <span className="ml-2 text-xl font-semibold">MeraSoftware</span>
            </div>
            <p className="text-gray-400">© 2025 MeraSoftware. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
  )
}
