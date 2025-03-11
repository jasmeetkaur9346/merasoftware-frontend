import React, { useState } from 'react';

const CardVariants = () => {
  const [selectedVariant, setSelectedVariant] = useState('all');

  const variants = [
    {
      id: 'light-blue',
      title: 'Learning Management System',
      price: '₹89,990',
      originalPrice: '₹2,40,000',
      discount: 'Save 62% today',
      features: ['Premium Theme', 'Free Content Updates', 'Free Maintenance'],
      category: 'Cloud Software Development',
      colors: {
        gradient: 'from-blue-100 to-indigo-200',
        accent: 'blue-500',
        buttonGradient: 'from-blue-500 to-indigo-600',
        textDark: 'blue-900',
        textLight: 'blue-700'
      }
    },
    {
      id: 'light-teal',
      title: 'CRM',
      price: '₹89,990',
      originalPrice: '₹2,40,000',
      discount: 'Save 62% today',
      features: ['Premium Theme', 'Free Content Updates', 'Free Maintenance'],
      category: 'Cloud Software Development',
      colors: {
        gradient: 'from-teal-100 to-emerald-200',
        accent: 'teal-500',
        buttonGradient: 'from-teal-500 to-emerald-600',
        textDark: 'teal-900',
        textLight: 'teal-700'
      }
    },
    {
      id: 'light-purple',
      title: 'Inventory Management System',
      price: '₹95,500',
      originalPrice: '₹2,20,000',
      discount: 'Save 57% today',
      features: ['Premium Theme', 'Free Content Updates', 'Free Maintenance'],
      category: 'Cloud Software Development',
      colors: {
        gradient: 'from-purple-100 to-violet-200',
        accent: 'purple-500',
        buttonGradient: 'from-purple-500 to-violet-600',
        textDark: 'purple-900',
        textLight: 'purple-700'
      }
    },
    {
      id: 'light-rose',
      title: 'CMS',
      price: '₹1,05,999',
      originalPrice: '₹2,40,000',
      discount: 'Save 56% today',
      features: ['Premium Theme', 'Free Content Updates', 'Free Maintenance', 'Admin Panel Integration'],
      category: 'Cloud Software Development',
      colors: {
        gradient: 'from-rose-100 to-pink-200',
        accent: 'rose-500',
        buttonGradient: 'from-rose-500 to-pink-600',
        textDark: 'rose-900',
        textLight: 'rose-700'
      }
    }
  ];

  const colorVariants = selectedVariant === 'all' ? variants : variants.filter(v => v.id === selectedVariant);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Modern Light Card Designs</h1>
      
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 mb-4 min-w-max">
          <button 
            className={`px-4 py-2 rounded-full shadow-sm ${selectedVariant === 'all' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            onClick={() => setSelectedVariant('all')}
          >
            All Styles
          </button>
          {variants.map(variant => (
            <button 
              key={variant.id}
              className={`px-4 py-2 rounded-full shadow-sm ${selectedVariant === variant.id ? 'bg-' + variant.colors.accent + ' text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
              onClick={() => setSelectedVariant(variant.id)}
            >
              {variant.id.split('-')[1].charAt(0).toUpperCase() + variant.id.split('-')[1].slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colorVariants.map((variant, idx) => (
          <div key={idx} className="relative rounded-xl overflow-hidden shadow-md border border-gray-100">
            <div className={`absolute inset-0 bg-gradient-to-br ${variant.colors.gradient}`}></div>
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="flex flex-col md:flex-row relative backdrop-blur-sm">
              {/* Left side - Info */}
              <div className="p-5 md:w-1/2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full bg-${variant.colors.accent}`}></div>
                  <div className={`w-2 h-2 rounded-full bg-${variant.colors.textLight} opacity-50`}></div>
                  <div className={`w-2 h-2 rounded-full bg-${variant.colors.textLight} opacity-30`}></div>
                </div>
                
                <div className="bg-white/60 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white/60 shadow-sm">
                  <h2 className={`text-xl font-bold mb-1 text-${variant.colors.textDark}`}>{variant.title}</h2>
                  <p className={`text-${variant.colors.textLight} mb-3 text-xs`}>{variant.category}</p>
                  
                  <div>
                    <div className="flex items-baseline">
                      <span className={`text-2xl font-bold text-${variant.colors.textDark}`}>{variant.price}</span>
                      <span className="text-xs text-gray-500 line-through ml-2">{variant.originalPrice}</span>
                    </div>
                    <span className="text-green-600 text-xs block">{variant.discount}</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - Features */}
              <div className="p-5 md:w-1/2 border-t md:border-t-0 md:border-l border-white/40">
                <div className="bg-white/60 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white/60 shadow-sm h-full flex flex-col">
                  <h3 className={`font-medium mb-3 text-${variant.colors.textDark} text-sm`}>Features:</h3>
                  <ul className="space-y-2 mb-4">
                    {variant.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className={`w-4 h-4 text-${variant.colors.accent} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-${variant.colors.textLight} text-sm`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full bg-gradient-to-r ${variant.colors.buttonGradient} text-white py-2 text-sm rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 mt-auto shadow-sm`}>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardVariants;