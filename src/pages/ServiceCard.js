import React, { useState } from 'react';
import { ChevronRight, Check, ArrowRight, ShoppingCart, Search, User, Heart } from 'lucide-react';

const EcommerceLandingPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // Toggle login form
  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };
  
  // Service categories
  const serviceCategories = [
    {
      id: 1,
      name: "Website Development",
      icon: "🌐",
      image: "/api/placeholder/300/300",
      description: "Professional websites tailored to your business needs"
    },
    {
      id: 2,
      name: "Web App Development",
      icon: "💻",
      image: "/api/placeholder/300/300",
      description: "Powerful web applications with advanced functionality"
    },
    {
      id: 3,
      name: "Mobile App Development",
      icon: "📱",
      image: "/api/placeholder/300/300",
      description: "Native and cross-platform mobile applications"
    },
    {
      id: 4,
      name: "Features & Upgrades",
      icon: "⚡",
      image: "/api/placeholder/300/300",
      description: "Enhance your existing products with new capabilities"
    }
  ];
  
  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Basic Website Package",
      category: "Website Development",
      price: 9999,
      image: "/api/placeholder/250/250",
      rating: 4.7,
      reviewCount: 128,
      features: ["5 Pages", "Mobile Responsive", "Contact Form", "1 Month Support"]
    },
    {
      id: 2,
      name: "E-commerce Store",
      category: "Web App Development",
      price: 24999,
      image: "/api/placeholder/250/250",
      rating: 4.9,
      reviewCount: 84,
      features: ["Product Catalog", "Shopping Cart", "Payment Gateway", "Order Management"]
    },
    {
      id: 3,
      name: "Android App Development",
      category: "Mobile App Development",
      price: 19999,
      image: "/api/placeholder/250/250",
      rating: 4.8,
      reviewCount: 56,
      features: ["Native Android", "Google Play Store", "Push Notifications", "Analytics"]
    },
    {
      id: 4,
      name: "iOS App Development",
      category: "Mobile App Development",
      price: 21999,
      image: "/api/placeholder/250/250",
      rating: 4.6,
      reviewCount: 42,
      features: ["Native iOS", "App Store", "In-App Purchases", "User Authentication"]
    },
    {
      id: 5,
      name: "Premium SEO Package",
      category: "Features & Upgrades",
      price: 7999,
      image: "/api/placeholder/250/250",
      rating: 4.5,
      reviewCount: 93,
      features: ["Keyword Research", "On-page SEO", "Technical SEO", "Monthly Reports"]
    },
    {
      id: 6,
      name: "Payment Gateway Integration",
      category: "Features & Upgrades",
      price: 4999,
      image: "/api/placeholder/250/250",
      rating: 4.8,
      reviewCount: 64,
      features: ["Multiple Gateways", "Secure Checkout", "Transaction Reports", "Refund Management"]
    }
  ];
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navigation - E-commerce Style */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top header with logo and search */}
          <div className="py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-800">ServiceHub</span>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button className="hidden sm:flex items-center text-gray-700 hover:text-blue-600">
                <Heart size={20} />
                <span className="ml-1 text-sm">Wishlist</span>
              </button>
              <button className="hidden sm:flex items-center text-gray-700 hover:text-blue-600">
                <ShoppingCart size={20} />
                <span className="ml-1 text-sm">Cart</span>
              </button>
              <button 
                onClick={toggleLoginForm}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <User size={20} />
                <span className="ml-1 text-sm">Account</span>
              </button>
            </div>
          </div>
          
          {/* Bottom header with categories */}
          <nav className="border-t py-3">
            <ul className="flex justify-between overflow-x-auto scrollbar-none">
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">All Services</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Website Development</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Web App Development</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Mobile App Development</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Features & Upgrades</a></li>
              <li><a href="#" className="text-gray-800 font-medium whitespace-nowrap hover:text-blue-600 px-3">Special Offers</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Login Form (Conditional) */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={toggleLoginForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
            
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot Password?</a>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Register now</a>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">One-Stop Digital Services Platform</h1>
              <p className="text-blue-100 text-lg mb-6">Browse, purchase, and manage all your digital service needs in one place. From websites to mobile apps and everything in between.</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center">
                Shop Now <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/api/placeholder/600/300" 
                alt="Services Banner" 
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Categories - E-commerce Style, Square Cards in a Row */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <a 
                key={category.id} 
                href="#" 
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden aspect-square relative">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{category.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products - E-commerce Style */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.category}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {"★".repeat(Math.round(product.rating))}
                      {"☆".repeat(5 - Math.round(product.rating))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">({product.reviewCount} reviews)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="text-lg font-bold text-gray-800 mb-3">
                    {formatCurrency(product.price)}
                  </div>
                  
                  {/* Features */}
                  <ul className="mb-4 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <Check size={14} className="text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1 flex items-center justify-center">
                      <ShoppingCart size={16} className="mr-1" /> Add to Cart
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 p-2 rounded-lg transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Special Offer Banner */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <div className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Limited Time Offer
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">20% Off on All Web Development Packages</h2>
                <p className="text-purple-100 mb-6">Launch your dream website or web application at a special discounted price. Offer valid until March 15, 2025.</p>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Claim Offer
                </button>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/api/placeholder/500/300" 
                  alt="Special Offer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajiv Mehta",
                company: "TechSolutions Inc.",
                quote: "The website development service exceeded our expectations. Professional, responsive, and delivered on time.",
                image: "/api/placeholder/100/100"
              },
              {
                name: "Priya Sharma",
                company: "Fashion Boutique",
                quote: "Our mobile app has transformed our business. The team was incredibly knowledgeable and supportive throughout the process.",
                image: "/api/placeholder/100/100"
              },
              {
                name: "Amitabh Singh",
                company: "CloudServer Technologies",
                quote: "The web application they built for us streamlined our operations and increased efficiency by 40%. Highly recommended!",
                image: "/api/placeholder/100/100"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="mt-4 text-yellow-400">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-10 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Digital Presence?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">Browse our catalog of services and find the perfect solution for your business needs.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Shop Now
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-bold text-white">ServiceHub</span>
              </div>
              <p className="text-sm">Your one-stop shop for all digital services. We help businesses build and enhance their online presence.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Website Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Web App Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features & Upgrades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Special Offers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">My Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@servicehub.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Tech Park, Bangalore - 560001</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>

                  </a>
                  </div>
                  </div>

                  </div>

                  </div>
                  </footer>
                  </div>
)};

export default EcommerceLandingPage