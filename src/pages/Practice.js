import React, { useState } from 'react';
import { ChevronRight, Users, Globe, Smartphone, Database, Code,  UserCheck, Search, Settings, Link, Star, Plus, MapPin, Phone, Mail, Shield, Clock, Award, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const services = [
  {
    icon: Users,
    iconBg: 'bg-blue-100/50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    glowColor: 'group-hover:shadow-blue-300/50',
    title: 'Portfolio Website',
    specs: [
      'Responsive Design Branding',
      'Custom Contact Forms'
    ],
    price: '₹6,999',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-blue-100',
    accentColor: 'bg-blue-600',
  },
  {
    icon: Globe,
    iconBg: 'bg-green-100/50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    glowColor: 'group-hover:shadow-green-300/50',
    title: 'Business Website',
    specs: [
      'Multi-page Professional Layout',
      'Service Showcase Pages'
    ],
    price: '₹12,999',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-green-100',
    accentColor: 'bg-green-600',
  },
  {
    icon: Smartphone,
    iconBg: 'bg-purple-100/50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    glowColor: 'group-hover:shadow-purple-300/50',
    title: 'Mobile App',
    specs: [
      'Native App Development',
      'Payment Gateway Integration'
    ],
    price: '₹65,999',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-purple-100',
    accentColor: 'bg-purple-600',
  },
  {
    icon: Settings,
    iconBg: 'bg-orange-100/50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    glowColor: 'group-hover:shadow-orange-300/50',
    title: 'Web Software',
    specs: [
      'Custom Business Solutions',
      'Database System Integration'
    ],
    price: '₹45,999',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-orange-100',
    accentColor: 'bg-orange-600',
  }
];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">MeraSoftware</span>
          </div>
          <nav className="hidden lg:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Solutions</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 font-medium">Sign In</button>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Trusted by 500+ Businesses
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                We Build Software
                <span className="block text-blue-600">That Fits Your Needs</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                We start by understanding your business challenges, then design and develop software tailored to your exact requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center transition-all transform hover:scale-105">
                  Start Your Project <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 font-semibold transition-colors">
                  View Portfolio
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Client Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Professional team working on software development" 
                  className="rounded-3xl shadow-3xl border-4 border-blue-600"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">99.9% Uptime</div>
                    <div className="text-sm text-gray-600">Enterprise Grade Security</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Customer Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              For Our Valued Clients
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
              Your Project,
              <span className=" text-blue-600"> Always in Your Hands</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-7xl mx-auto">
              Log in to your client portal to check progress, share updates with your developer, and raise support requests whenever needed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Customer Dashboard Interface" 
                  className="rounded-2xl shadow-2xl w-full h-full"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">500+ Active</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                </div>
              </div>
              {/* Floating Feature Card */}
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live Dashboard</span>
                </div>
              </div>
            </div>

            {/* Information & Directions Side */}
            <div className="space-y-8">

              {/* Direction Cards */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">Track Your Project Progress</h3>
                      <p className="text-gray-600">Access your dashboard to see how much work has been completed.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center transition-colors">
                      Dashboard<ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <Plus className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">Share Data & Updates</h3>
                      <p className="text-gray-600">Directly connect with your project developer — share files & chat inside the portal.</p>
                    </div>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium flex items-center transition-colors">
                      Open Portal <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">Get Help & Support</h3>
                      <p className="text-gray-600">Submit tickets for any issues and get quick help from our team.</p>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium flex items-center transition-colors">
                      Support <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">500+</div>
                  <div className="text-sm text-gray-600">Projects Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Tickets Resolved on Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* New Customer Section - Merged with What Do You Need boxes */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Business?</h2>
      <p className="text-xl text-gray-600 max-w-6xl mx-auto">Explore the options and choose the solution that matches your need.</p>
    </div>
    <div className="bg-white p-10 rounded-3xl shadow-xl max-w-6xl mx-auto border border-gray-100">
      <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">What's Your Primary Business Goal?</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-xl border border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="bg-gradient-to-r from-blue-500 to-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Simple Website</h3>
          <p className="text-gray-600 mb-4">Professional business website with modern design</p>
          <div className="text-blue-800 font-medium group-hover:text-blue-600">Starting from ₹5,999</div>
        </div>

        <div className="text-center p-6 rounded-xl border border-purple-200 hover:border-purple-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="bg-gradient-to-r from-purple-500 to-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Web Software</h3>
          <p className="text-gray-600 mb-4">Custom business management systems</p>
          <div className="text-purple-800 font-medium group-hover:text-purple-600">Starting from ₹19,999</div>
        </div>

        <div className="text-center p-6 rounded-xl border border-teal-200 hover:border-teal-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="bg-gradient-to-r from-teal-500 to-teal-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile App</h3>
          <p className="text-gray-600 mb-4">Native iOS and Android applications</p>
          <div className="text-teal-800 font-medium group-hover:text-teal-600">Starting from ₹59,999</div>
        </div>

        <div className="text-center p-6 rounded-xl border border-cyan-200 hover:border-cyan-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Promote Business on Google</h3>
          <p className="text-gray-600 mb-4">SEO optimization and Google business promotion</p>
          <div className="text-cyan-800 font-medium group-hover:text-cyan-600">Starting from ₹4,999</div>
        </div>

        <div className="text-center p-6 rounded-xl border border-pink-200 hover:border-pink-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="bg-gradient-to-r from-pink-500 to-pink-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Hire a Developer</h3>
          <p className="text-gray-600 mb-4">Dedicated developers for your project needs</p>
          <div className="text-pink-800 font-medium group-hover:text-pink-600">Lower cost than in-house</div>
        </div>

        <div className="text-center p-6 rounded-xl border border-indigo-200 hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Update Your Website/App</h3>
          <p className="text-gray-600 mb-4">Maintenance and updates for existing projects</p>
          <div className="text-indigo-800 font-medium group-hover:text-indigo-600">Explore our pricing plans</div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Built Software Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Enterprise-Ready Software Solutions</h2>
            <p className="text-xl text-gray-600 max-w-7xl mx-auto">Production-tested, scalable solutions built for modern businesses with enterprise-grade security and performance</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="CRM Dashboard" 
                  className="w-full h-48 rounded-2xl object-cover mb-6"
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Enterprise CRM</h3>
                </div>
                <p className="text-gray-600 text-lg mb-6">Complete customer lifecycle management with AI-powered insights, automation, and advanced analytics</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">Starting at ₹50,000</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:translate-x-1 transition-transform">
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="E-commerce Platform" 
                  className="w-full h-48 rounded-2xl object-cover mb-6"
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <Smartphone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">E-commerce Suite</h3>
                </div>
                <p className="text-gray-600 text-lg mb-6">Full-stack e-commerce platform with payment processing, inventory management, and mobile optimization</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">Starting at ₹75,000</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:translate-x-1 transition-transform">
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Inventory Management" 
                  className="w-full h-48 rounded-2xl object-cover mb-6"
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Smart Inventory</h3>
                </div>
                <p className="text-gray-600 text-lg mb-6">AI-powered inventory management with predictive analytics, automated reordering, and real-time tracking</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">Starting at ₹40,000</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:translate-x-1 transition-transform">
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Our Popular Development Services */}
<section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Popular Development Services</h2>
      <p className="text-xl text-gray-600">These are the services most of our clients choose for their business growth</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <div 
          key={index} 
          className={`
            relative group cursor-pointer 
            bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo}
            rounded-3xl p-6 
            border ${service.borderColor}
            shadow-lg hover:shadow-xl 
            ${service.glowColor}
            transition-all duration-300 
            transform hover:-translate-y-2
            overflow-hidden
          `}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {/* Add navigation or modal logic here */}}
        >
          {/* Animated Background Effect */}
          <div 
            className={`
              absolute -inset-px 
              bg-gradient-to-r 
              opacity-0 group-hover:opacity-20 
              transition-opacity duration-300
              ${service.accentColor}
            `}
          ></div>
          
          {/* Card Content */}
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className={`
                w-16 h-16 ${service.iconBg} 
                rounded-2xl flex items-center 
                justify-center
                border ${service.borderColor}
              `}>
                <service.icon className={`w-8 h-8 ${service.iconColor}`} />
              </div>
              {hoveredCard === index && (
                <ArrowRight 
                  className={`
                    w-6 h-6 ${service.iconColor} 
                    transform transition-transform 
                    group-hover:translate-x-1
                  `} 
                />
              )}
            </div>

            <h3 className="font-bold text-2xl mb-4 text-gray-900">{service.title}</h3>
            
            <ul className="text-xs text-gray-700 space-y-1 mb-6 h-10">
              {service.specs.map((spec, specIndex) => (
                <li key={specIndex} className="flex items-center">
                  <span className={`w-1.5 h-1.5 ${service.accentColor} rounded-full mr-3`}></span>
                  {spec}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Starting from</p>
              <p className="text-3xl font-bold text-gray-900">{service.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      {/* Core Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Expertise</h2>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">End-to-end technology solutions powered by cutting-edge frameworks and industry best practices</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Web Development" 
                  className="w-40 h-30 rounded-2xl object-cover mx-auto mb-4 group-hover:scale-110 transition-transform"
                />
                
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Web Development</h3>
              <p className="text-gray-600">Full-stack web applications with modern frameworks and cloud deployment</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Mobile Development" 
                  className="w-40 h-30 rounded-2xl object-cover mx-auto mb-4 group-hover:scale-110 transition-transform"
                />
                
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Mobile Development</h3>
              <p className="text-gray-600">Native iOS and Android apps with cross-platform compatibility</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Enterprise Software" 
                  className="w-40 h-30 rounded-2xl object-cover mx-auto mb-4 group-hover:scale-110 transition-transform"
                />
               
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Enterprise Solutions</h3>
              <p className="text-gray-600">Scalable business systems with enterprise-grade security and performance</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Consulting" 
                  className="w-40 h-30 rounded-2xl object-cover mx-auto mb-4 group-hover:scale-110 transition-transform"
                />
                
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Strategic Consulting</h3>
              <p className="text-gray-600">Technology strategy, digital transformation, and architecture consulting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">Real success stories from businesses that have transformed with our solutions</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                  alt="Raj Patel" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-bold text-lg text-gray-900">Raj Patel</div>
                  <div className="text-gray-600">CEO, TechVenture Inc.</div>
                </div>
              </div>
              <div className="flex mb-6">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">"MeraSoftware transformed our business operations completely. Their ongoing support and innovative approach have been instrumental in our 300% growth over the past two years."</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                  alt="Priya Sharma" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-bold text-lg text-gray-900">Priya Sharma</div>
                  <div className="text-gray-600">Founder, Digital Solutions</div>
                </div>
              </div>
              <div className="flex mb-6">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">"The enterprise-grade solutions and exceptional support team make MeraSoftware our trusted technology partner. Their expertise in modern frameworks is unmatched."</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                  alt="Amit Kumar" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-bold text-lg text-gray-900">Amit Kumar</div>
                  <div className="text-gray-600">CTO, E-commerce Pro</div>
                </div>
              </div>
              <div className="flex mb-6">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">"Working with MeraSoftware has been a game-changer. Their scalable solutions and proactive approach to technology challenges have exceeded all our expectations."</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 font-semibold flex items-center mx-auto shadow-lg border border-gray-100 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Experience
            </button>
          </div>
        </div>
      </section>

            {/* Portfolio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Work</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A glimpse of the projects we’ve delivered for businesses across different industries.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Portfolio Item 1 */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="Business Website" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">Corporate Website</h3>
                <p className="text-gray-600 text-sm mb-4">Multi-page business website with responsive design and service showcase pages.</p>
                <button className="text-blue-600 font-semibold hover:underline">View Project</button>
              </div>
            </div>

            {/* Portfolio Item 2 */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" 
                alt="CRM Software" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">Custom CRM</h3>
                <p className="text-gray-600 text-sm mb-4">End-to-end customer management system with advanced reporting and analytics.</p>
                <button className="text-blue-600 font-semibold hover:underline">View Project</button>
              </div>
            </div>

            {/* Portfolio Item 3 */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=800&q=80" 
                alt="E-commerce Platform" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">E-commerce Platform</h3>
                <p className="text-gray-600 text-sm mb-4">Online shopping system with payment integration and mobile optimization.</p>
                <button className="text-blue-600 font-semibold hover:underline">View Project</button>
              </div>
            </div>

            {/* Portfolio Item 4 */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80" 
                alt="Mobile App" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">Mobile Application</h3>
                <p className="text-gray-600 text-sm mb-4">Cross-platform native mobile app with user-friendly design and push notifications.</p>
                <button className="text-blue-600 font-semibold hover:underline">View Project</button>
              </div>
            </div>

            {/* Portfolio Item 5 */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" 
                alt="Inventory Software" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">Inventory Management</h3>
                <p className="text-gray-600 text-sm mb-4">Smart inventory solution with automated tracking and predictive analytics.</p>
                <button className="text-blue-600 font-semibold hover:underline">View Project</button>
              </div>
            </div>

            {/* Portfolio Item 6 */}
            <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1504691342899-9ea1d155a4be?auto=format&fit=crop&w=800&q=80" 
                alt="SEO Project" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">SEO & Google Promotion</h3>
                <p className="text-gray-600 text-sm mb-4">Local SEO and Google Business Profile optimization for higher visibility.</p>
                <button className="text-blue-600 font-semibold hover:underline">View Project</button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Let's Build Something Amazing Together</h2>
            <p className="text-xl text-gray-600 max-w-7xl mx-auto">Ready to transform your business with cutting-edge technology? Get in touch with our expert team</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-10 rounded-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Start Your Project</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Business Email</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Project Details</label>
                  <textarea 
                    rows={5} 
                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                    placeholder="Tell us about your project requirements and goals..."
                  ></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 font-semibold text-lg transition-colors transform hover:scale-105">
                  Send Project Inquiry
                </button>
              </div>
            </div>
            
            {/* Map and Contact Info */}
            <div className="space-y-8">
              <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Office Location" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-600 bg-opacity-80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Visit Our Office</h4>
                    <p>Interactive map integration available</p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Head Office</h4>
                      <p className="text-gray-600 text-sm">Tech Hub, Innovation District</p>
                    </div>
                  </div>
                  <p className="text-gray-700">123 Business Street, Tech City, TC 12345</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600 text-sm">Business Hours: 9 AM - 7 PM</p>
                    </div>
                  </div>
                  <p className="text-gray-700">+91 98765 43210</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <p className="text-gray-600 text-sm">Quick Response Guaranteed</p>
                    </div>
                  </div>
                  <p className="text-gray-700">hello@merasoftware.com</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Support</h4>
                      <p className="text-gray-600 text-sm">24/7 Technical Assistance</p>
                    </div>
                  </div>
                  <p className="text-gray-700">support@merasoftware.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-bold">MeraSoftware</span>
              </div>
              <p className="text-gray-300 text-lg mb-6 max-w-md">Building enterprise-grade software solutions that drive business growth and digital transformation for forward-thinking companies.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Services</h3>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cloud Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consulting</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Solutions</h3>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">CRM Systems</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-commerce Platforms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio Websites</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Automation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Development</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 MeraSoftware. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
              <p className="text-gray-600">Sign in to share your experience with our community</p>
            </div>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;