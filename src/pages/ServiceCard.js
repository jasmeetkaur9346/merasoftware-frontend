import React, { useState } from 'react';

// Header Component
const Header = () => {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl mr-3">M</div>
          <div className="font-semibold text-lg text-gray-900">MeraSoftware</div>
        </div>
        <div className="flex items-center">
          <div className="ml-5 text-gray-500 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
          </div>
          <div className="ml-5">
            <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-gray-300"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Component
const Hero = () => {
  return (
    <section className="bg-gray-800 h-96 flex items-center justify-start relative bg-opacity-50 bg-blend-overlay bg-center bg-cover">
      <div className="max-w-xl px-12">
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Restaurant Website Solution</h1>
        <p className="text-lg text-white opacity-90 mb-8">Professional online presence for restaurants, cafes, and food businesses.</p>
        <a href="#" className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-amber-600 hover:-translate-y-1 hover:shadow-lg">Explore Features</a>
      </div>
    </section>
  );
};

// Audience Component
const Audience = () => {
  const audienceItems = [
    { icon: '🍽️', text: 'Small Restaurants' },
    { icon: '☕', text: 'Cafes' },
    { icon: '🍽️', text: 'Indian Dhabas' },
    { icon: '🔒', text: 'Fast Food Outlets' },
    { icon: '🍔', text: 'Food Chains' },
    { icon: '🥡', text: 'Street Food Vendors' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Who is it for?</h2>
        <span className="text-blue-600 font-medium text-sm cursor-pointer">View All</span>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {audienceItems.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center transition-all duration-300 border border-gray-200 hover:border-blue-600 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 text-lg">
                {item.icon}
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Features Component
const Features = () => {
  const featureItems = [
    {
      icon: '⭐',
      title: 'Premium Theme',
      description: 'Exclusive premium theme included with your purchase',
    },
    {
      icon: '🕒',
      title: 'Free Content Updates',
      description: '1-month free content updates and modifications',
    },
    {
      icon: '🔧',
      title: 'Free Maintenance',
      description: '1-year free maintenance and technical support',
    },
    {
      icon: '🍽️',
      title: 'Complete Food Menu',
      description: 'Comprehensive food menu management system',
    },
    {
      icon: '👥',
      title: 'User Friendly',
      description: 'Easy to use and manage for non-technical users',
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Looks great on all devices - mobile, tablet and desktop',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">What's Included</h2>
        <span className="text-blue-600 font-medium text-sm cursor-pointer">Learn More</span>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureItems.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600 text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Testimonial Component
const Testimonial = ({ text, name, position }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <p className="italic mb-4 text-gray-900 text-sm leading-relaxed">"{text}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
        <div>
          <h4 className="text-sm font-semibold mb-0.5">{name}</h4>
          <p className="text-xs text-gray-500">{position}</p>
        </div>
      </div>
    </div>
  );
};

// Description Component
const Description = () => {
  const testimonials = [
    {
      text: "This restaurant website solution helped us increase our online orders by 35% in just two months. The design is professional and our customers love how easy it is to navigate.",
      name: "Rahul Sharma",
      position: "Owner, Spice Garden",
    },
    {
      text: "The team at MeraSoftware delivered our website in just a week. The food menu management system is exactly what we needed to showcase our changing seasonal offerings.",
      name: "Priya Patel",
      position: "Manager, Cafe Delight",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Description</h2>
      </div>
      <div className="p-8">
        <p className="text-gray-500 leading-relaxed">
          A simple and visually appealing restaurant website that displays the menu, restaurant details, and contact information. Perfect for showcasing dishes, operating hours, and location without the need for frequent updates. The responsive design ensures your customers can browse your menu from any device.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              text={testimonial.text}
              name={testimonial.name}
              position={testimonial.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Price Calculator Component
const PriceCalculator = () => {
  const [pageCount, setPageCount] = useState(5);
  const [dynamicPage, setDynamicPage] = useState(false);
  const [dynamicGallery, setDynamicGallery] = useState(false);
  const [liveChat, setLiveChat] = useState(false);
  
  const basePrice = 8999;
  const additionalPagePrice = 1999;
  const dynamicPagePrice = 3999;
  const dynamicGalleryPrice = 7999;
  const liveChatPrice = 4999;
  
  const decrementPage = () => {
    if (pageCount > 5) {
      setPageCount(pageCount - 1);
    }
  };
  
  const incrementPage = () => {
    setPageCount(pageCount + 1);
  };
  
  const calculateTotal = () => {
    let total = basePrice;
    
    // Add price for additional pages beyond the base 5 pages
    if (pageCount > 5) {
      total += (pageCount - 5) * additionalPagePrice;
    }
    
    // Add price for optional features
    if (dynamicPage) total += dynamicPagePrice;
    if (dynamicGallery) total += dynamicGalleryPrice;
    if (liveChat) total += liveChatPrice;
    
    return total;
  };
  
  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-8 py-5 rounded-t-lg">
        <h2 className="text-xl font-semibold">Customize Your Website</h2>
      </div>
      <div className="p-8">
        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600 text-lg">
              📄
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Website Pages</h3>
              <p className="text-xs text-gray-500">Base Pages: 5</p>
              <p className="text-xs text-gray-500">₹1999 Per Additional Page</p>
            </div>
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button className="w-8 h-8 bg-gray-50 flex items-center justify-center text-base hover:bg-gray-200 transition-colors" onClick={decrementPage}>-</button>
            <input type="text" className="w-10 h-8 border-none text-center font-semibold text-sm" value={pageCount} readOnly />
            <button className="w-8 h-8 bg-gray-50 flex items-center justify-center text-base hover:bg-gray-200 transition-colors" onClick={incrementPage}>+</button>
          </div>
        </div>
        
        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600 text-lg">
              🔄
            </div>
            <div>
              <h3 className="text-sm font-semibold">Dynamic Page with Panel</h3>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold text-blue-600">₹3,999</div>
            <div className="relative w-6 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 absolute w-6 h-6 cursor-pointer z-10" 
                checked={dynamicPage}
                onChange={() => setDynamicPage(!dynamicPage)}
              />
              <span className={`absolute top-0 left-0 w-6 h-6 bg-gray-50 border border-gray-200 rounded transition-colors ${dynamicPage ? 'bg-blue-600 border-blue-600' : ''}`}>
                {dynamicPage && <span className="absolute inset-0 flex items-center justify-center text-white">✓</span>}
              </span>
            </div>
          </div>
        </div>
        
        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600 text-lg">
              🖼️
            </div>
            <div>
              <h3 className="text-sm font-semibold">Dynamic Gallery</h3>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold text-blue-600">₹7,999</div>
            <div className="relative w-6 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 absolute w-6 h-6 cursor-pointer z-10" 
                checked={dynamicGallery}
                onChange={() => setDynamicGallery(!dynamicGallery)}
              />
              <span className={`absolute top-0 left-0 w-6 h-6 bg-gray-50 border border-gray-200 rounded transition-colors ${dynamicGallery ? 'bg-blue-600 border-blue-600' : ''}`}>
                {dynamicGallery && <span className="absolute inset-0 flex items-center justify-center text-white">✓</span>}
              </span>
            </div>
          </div>
        </div>
        
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600 text-lg">
              💬
            </div>
            <div>
              <h3 className="text-sm font-semibold">Live Chat</h3>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold text-blue-600">₹4,999</div>
            <div className="relative w-6 h-6">
              <input 
                type="checkbox" 
                className="opacity-0 absolute w-6 h-6 cursor-pointer z-10" 
                checked={liveChat}
                onChange={() => setLiveChat(!liveChat)}
              />
              <span className={`absolute top-0 left-0 w-6 h-6 bg-gray-50 border border-gray-200 rounded transition-colors ${liveChat ? 'bg-blue-600 border-blue-600' : ''}`}>
                {liveChat && <span className="absolute inset-0 flex items-center justify-center text-white">✓</span>}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-6 mt-5 border-t-2 border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total Price:</span>
          <span className="text-2xl font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-4 rounded-lg text-base font-semibold mt-8 transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg">Get Started</button>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Our Team", "Careers", "Contact Us"]
    },
    {
      title: "Services",
      links: ["Web Development", "Mobile Apps", "E-commerce", "SEO"]
    },
    {
      title: "Support",
      links: ["FAQs", "Help Center", "Privacy Policy", "Terms of Service"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-5">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl mr-3">M</div>
              <div className="font-semibold text-lg text-white">MeraSoftware</div>
            </div>
            <p className="text-gray-400 mb-5 text-sm leading-relaxed">
              We create professional websites and software solutions for businesses of all sizes. Our team is dedicated to delivering high-quality digital products that help our clients grow their business.
            </p>
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <div className="w-9 h-9 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </div>
              <div className="w-9 h-9 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <div className="w-9 h-9 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </div>
          </div>
          
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold mb-5 text-white">{column.title}</h3>
              <ul>
                {column.links.map((link, linkIndex) => (
                  <li className="mb-3" key={linkIndex}>
                    <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-8 border-t border-gray-800 text-gray-400 text-sm">
          © {new Date().getFullYear()} MeraSoftware. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const RestaurantWebsite = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Audience />
            <Features />
            <Description />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PriceCalculator />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantWebsite;