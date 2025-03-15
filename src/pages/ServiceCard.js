import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WebsiteTemplateSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const templates = [
    {
      id: 1,
      title: 'College Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 3 more'],
      color: '#2196f3',
      tagline: 'Academic Excellence',
      description: 'Perfect for universities and schools'
    },
    {
      id: 2,
      title: 'Educational Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 1 more'],
      color: '#4caf50',
      tagline: 'Knowledge Portal',
      description: 'Ideal for online courses and learning'
    },
    {
      id: 3,
      title: 'Local Service Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 2 more'],
      color: '#ff9800',
      tagline: 'Service Directory',
      description: 'Connect customers with local businesses'
    },
    {
      id: 4,
      title: 'Portfolio Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 1 more'],
      color: '#607d8b',
      tagline: 'Showcase Your Work',
      description: 'Perfect for artists and professionals'
    },
    {
      id: 5,
      title: 'Restaurant Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 3 more'],
      color: '#e91e63',
      tagline: 'Culinary Experience',
      description: 'Showcase menus and reservations'
    },
    {
      id: 6,
      title: 'E-commerce Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 4 more'],
      color: '#9c27b0',
      tagline: 'Online Store',
      description: 'Sell products with ease'
    },
    {
      id: 7,
      title: 'Corporate Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 2 more'],
      color: '#3f51b5',
      tagline: 'Business Solutions',
      description: 'Professional services for your company'
    },
    {
      id: 8,
      title: 'Blog Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 2 more'],
      color: '#009688',
      tagline: 'Share Your Stories',
      description: 'Perfect for content creators'
    },
    {
      id: 9,
      title: 'Fitness Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 3 more'],
      color: '#ff5722',
      tagline: 'Get Fit Today',
      description: 'Membership and class scheduling'
    },
    {
      id: 10,
      title: 'Medical Website',
      features: ['Premium Theme', 'Free Content Updates', '+ 3 more'],
      color: '#00bcd4',
      tagline: 'Healthcare Services',
      description: 'For clinics and medical practices'
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : 0
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < templates.length - 3 ? prevIndex + 1 : templates.length - 3
    );
  };

  const visibleTemplates = templates.slice(currentIndex, currentIndex + 3);

  // Function to render template preview in corporate style for all cards
  const renderTemplatePreview = (template) => {
    const { title, color, tagline, description } = template;
    
    return (
      <div className="h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-100"></div>
        <div className="absolute inset-0 flex flex-col">
          <div className="h-12 bg-white flex items-center px-4 shadow-sm">
            <div className="font-bold text-lg truncate" style={{ color: color }}>{title.toUpperCase()}</div>
          </div>
          <div className="flex-1 flex items-center p-4">
            <div className="w-1/2">
              <div className="text-xl font-bold truncate" style={{ color: color }}>{tagline}</div>
              <div className="text-sm mt-1 text-gray-600">{description}</div>
              <button className="mt-2 text-white text-xs px-3 py-1 rounded" style={{ backgroundColor: color }}>
                LEARN MORE
              </button>
            </div>
            <div className="w-1/2 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: `${color}33` }}>
                  {/* Optional: different icon for each type */}
                  {title === 'Medical Website' && (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: color }}>+</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Standard Websites</h2>
        <a href="#view-all" className="text-blue-600 hover:underline">View All</a>
      </div>
      
      <div className="relative">
        <button 
          onClick={handlePrev} 
          className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 ${currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-5 transition-transform duration-300">
          {visibleTemplates.map((template) => (
            <div 
              key={template.id} 
              className="flex-none w-full max-w-sm border rounded-lg overflow-hidden shadow-md bg-white"
            >
              {renderTemplatePreview(template)}
              
              <div className="p-4">
                <h3 className="font-bold text-xl mb-3">{template.title}</h3>
                <ul className="space-y-2 mb-4">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="w-full py-2 rounded font-medium text-white text-center transition-colors"
                  style={{ backgroundColor: template.color }}
                >
                  Customize Plan
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleNext} 
          className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 ${currentIndex >= templates.length - 3 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          disabled={currentIndex >= templates.length - 3}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: templates.length - 2 }).map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${currentIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default WebsiteTemplateSlider;