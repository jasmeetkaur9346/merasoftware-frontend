import React from 'react';

const RestaurantWebsiteLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Main content */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          
          
          {/* Two sections in a responsive layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Who is it for? Section (smaller) */}
            <div className="w-full md:w-2/5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Who is it for?</h2>
                <p className="text-gray-600 text-sm mb-4">Our website solutions are specially designed for various food businesses of all sizes.</p>
                <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 rounded-lg p-2.5 text-sm hover:bg-blue-50 transition-colors">
                    <span className="text-blue-500">🍴</span> Restaurants
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 rounded-lg p-2.5 text-sm hover:bg-blue-50 transition-colors">
                    <span className="text-blue-500">☕</span> Cafes
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 rounded-lg p-2.5 text-sm hover:bg-blue-50 transition-colors">
                    <span className="text-blue-500">🍴</span> Dhabas
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 rounded-lg p-2.5 text-sm hover:bg-blue-50 transition-colors">
                    <span className="text-blue-500">🛒</span> Fast Food
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 rounded-lg p-2.5 text-sm hover:bg-blue-50 transition-colors">
                    <span className="text-blue-500">🚗</span> Food Chains
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 rounded-lg p-2.5 text-sm hover:bg-blue-50 transition-colors">
                    <span className="text-blue-500">🛵</span> Street Food
                  </button>
                </div>
              </div>
            </div>
            
            {/* What's Included Section (larger) */}
            <div className="w-full md:w-3/5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-gray-800">What's Included</h2>
                <p className="text-gray-600 text-sm mb-4">Every restaurant website package comes with these premium features to enhance your online presence.</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-blue-500">🎨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Premium Theme</h3>
                      <p className="text-gray-600 text-sm">Exclusive premium theme included with your purchase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-blue-500">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Free Content Updates</h3>
                      <p className="text-gray-600 text-sm">1-month free content updates and modifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-blue-500">🔧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Free Maintenance</h3>
                      <p className="text-gray-600 text-sm">1-year free maintenance and technical support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-blue-500">🍽️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Complete Food Menu</h3>
                      <p className="text-gray-600 text-sm">Comprehensive food menu management system</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <span className="text-blue-500">🖱️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">User Friendly</h3>
                      <p className="text-gray-600 text-sm">Intuitive interface for easy navigation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Introduction Section */}
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Restaurant Website Solutions</h1>
            <p className="text-gray-600">
              Elevate your food business online with our specialized website solutions designed for restaurants and food establishments. 
              Our packages are tailored to meet the specific needs of various food businesses, with features that enhance customer engagement and operational efficiency.
            </p>
          </div>
          
          {/* Benefits Section */}
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Benefits of Our Restaurant Websites</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-500">💻</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Mobile Responsive</h3>
                </div>
                <p className="text-gray-600 text-sm">Your website will look great on all devices, from phones to desktops</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-500">🔍</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">SEO Optimized</h3>
                </div>
                <p className="text-gray-600 text-sm">Get discovered by customers searching for restaurants in your area</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-500">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Fast Loading</h3>
                </div>
                <p className="text-gray-600 text-sm">Optimized for speed to reduce bounce rates and improve user experience</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-500">🔒</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Secure Payment</h3>
                </div>
                <p className="text-gray-600 text-sm">SSL encryption and secure payment gateways for online orders</p>
              </div>
            </div>
          </div>
          
          {/* How We Work Section */}
          <div className="bg-white rounded-lg p-5 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">How We Work</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Consultation</h3>
                  <p className="text-gray-600">We begin with a detailed discussion about your restaurant's needs, target audience, and specific features you want on your website.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Design & Development</h3>
                  <p className="text-gray-600">Our team designs a customized website that reflects your brand identity and develops all the required features.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Content Integration</h3>
                  <p className="text-gray-600">We help you upload your menu, images, and other content to make your website ready for launch.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Testing & Launch</h3>
                  <p className="text-gray-600">We thoroughly test your website on all devices and browsers before launching it to ensure a flawless experience.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Ongoing Support</h3>
                  <p className="text-gray-600">We provide continuous support and maintenance to keep your website running smoothly and updated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Sticky Customize Plan */}
        <div className="w-full lg:w-2/5 relative">
          <div className="lg:sticky lg:top-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold py-4 px-5 bg-blue-600 text-white rounded-t-lg">Customize Your Plan</h2>
            
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between p-3 border-b hover:bg-blue-50 transition-colors rounded">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>🛒</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Restaurant Website</h3>
                    <p className="text-xs text-gray-500">Standard Website</p>
                  </div>
                </div>
                <div className="text-blue-600 font-semibold">₹8,999</div>
              </div>
              
              <div className="flex items-center justify-between p-3 border-b hover:bg-blue-50 transition-colors rounded">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>W</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Add New Page</h3>
                    <p className="text-xs text-gray-500">₹1,999 Per Additional Unit</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-blue-600 font-semibold">₹1,999</div>
                  <input type="checkbox" className="h-5 w-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border-b hover:bg-blue-50 transition-colors rounded">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>D</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Dynamic Page with Panel</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-blue-600 font-semibold">₹3,999</div>
                  <input type="checkbox" className="h-5 w-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border-b hover:bg-blue-50 transition-colors rounded">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>D</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Dynamic Gallery</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-blue-600 font-semibold">₹7,999</div>
                  <input type="checkbox" className="h-5 w-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border-b hover:bg-blue-50 transition-colors rounded">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>L</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Live Chat</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-blue-600 font-semibold">₹4,999</div>
                  <input type="checkbox" className="h-5 w-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="pt-5 border-t mt-6 pb-4">
                <h3 className="font-medium mb-3 text-gray-800">Apply Coupon</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code" 
                    className="border rounded p-2.5 flex-grow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded font-medium transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantWebsiteLayout;