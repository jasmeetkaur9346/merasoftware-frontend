
import React, { useState } from 'react';

const WelcomeSlides = () => {
  const [sections, setSections] = useState({
    guestSlides: [
      {
        id: 1,
        number: 1,
        heading: "We Build Software That",
        message: "No templates, no shortcuts. Just custom software developed by our experienced team to meet your needs.",
        cta: "Learn More",
        status: "Active",
        displayOrder: 1
      },
      {
        id: 2,
        number: 2,
        heading: "Innovative Solutions For Modern",
        message: "Transform your business with cutting-edge technology solutions tailored specifically for your industry.",
        cta: "Get Started",
        status: "Draft",
        displayOrder: 2
      }
    ],
    welcomeSlides: [
      {
        id: 3,
        number: 1,
        heading: "Welcome Back, Explore Our",
        message: "Explore our services and start building your dream project today. Discover unlimited possibilities.",
        cta: "Explore Services",
        status: "Active",
        displayOrder: 1
      },
      {
        id: 4,
        number: 2,
        heading: "Your Journey Starts Here",
        message: "Join thousands of satisfied customers who have transformed their business with our solutions.",
        cta: "Start Journey",
        status: "Active",
        displayOrder: 2
      },
      {
        id: 5,
        number: 3,
        heading: "Unlock Premium Features Today",
        message: "Upgrade to premium and access advanced tools, priority support, and exclusive features.",
        cta: "Upgrade Now",
        status: "Inactive",
        displayOrder: 3
      }
    ],
    progressSlides: [
      {
        id: 6,
        number: 1,
        heading: "Track Your Progress With",
        message: "Monitor your project milestones, track development progress, and stay updated on deliverables.",
        cta: "View Progress",
        status: "Active",
        displayOrder: 1
      },
      {
        id: 7,
        number: 2,
        heading: "Analytics Dashboard Shows Real",
        message: "Get detailed insights into your project performance with comprehensive analytics and reporting tools.",
        cta: "View Analytics",
        status: "Active",
        displayOrder: 2
      }
    ]
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, sectionKey, index) => {
    setDraggedItem({ sectionKey, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, sectionKey, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem({ sectionKey, index });
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, targetSectionKey, targetIndex) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.sectionKey !== targetSectionKey) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const sourceIndex = draggedItem.index;
    
    if (sourceIndex === targetIndex) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    setSections(prevSections => {
      const newSections = { ...prevSections };
      const sectionItems = [...newSections[targetSectionKey]];
      
      // Remove item from source position
      const [movedItem] = sectionItems.splice(sourceIndex, 1);
      
      // Insert at target position
      sectionItems.splice(targetIndex, 0, movedItem);
      
      // Update display orders
      sectionItems.forEach((item, index) => {
        item.displayOrder = index + 1;
        item.number = index + 1;
      });
      
      newSections[targetSectionKey] = sectionItems;
      return newSections;
    });

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'Inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const renderSlideItem = (slide, index, sectionKey) => {
    const isDragging = draggedItem?.sectionKey === sectionKey && draggedItem?.index === index;
    const isDragOver = dragOverItem?.sectionKey === sectionKey && dragOverItem?.index === index;
    
    return (
      <div
        key={slide.id}
        draggable
        onDragStart={(e) => handleDragStart(e, sectionKey, index)}
        onDragOver={(e) => handleDragOver(e, sectionKey, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, sectionKey, index)}
        className={`
          bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move
          transition-all duration-200 hover:shadow-md
          ${isDragging ? 'opacity-50 scale-95' : ''}
          ${isDragOver ? 'border-blue-400 bg-blue-50' : ''}
        `}
      >
        <div className="flex items-start gap-4">
          {/* Number */}
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {slide.number}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Heading (first 4 words) */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {truncateText(slide.heading, 4)}
                </h3>
                
                {/* Message (some words) */}
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {truncateText(slide.message, 12)}
                </p>
                
                {/* CTA and Status */}
                <div className="flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    {slide.cta}
                  </button>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slide.status)}`}>
                    {slide.status}
                  </span>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex-shrink-0">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4d5a2bd1-da0e-4943-9426-e75b3a523bec.png" 
                  alt="Modern gradient abstract design representing digital transformation and innovation with blue and purple tones"
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Drag Handle */}
          <div className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (sectionKey, title, slides) => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {slides.length} slides
          </span>
        </div>
        
        <div className="space-y-0">
          {slides.map((slide, index) => renderSlideItem(slide, index, sectionKey))}
        </div>
        
        {slides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No slides in this section</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Content Management</h1>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Add Guest Slide
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add User Welcome
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {renderSection('guestSlides', 'Guest Slides', sections.guestSlides)}
            {renderSection('progressSlides', 'Progress Slides', sections.progressSlides)}
          </div>
          
          {/* Right Column */}
          <div>
            {renderSection('welcomeSlides', 'User Welcome', sections.welcomeSlides)}
          </div>
        </div>
        
        {/* Drag and Drop Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Drag and Drop Instructions</h3>
              <p className="text-blue-700 text-sm">
                Drag slides to reorder their priority within each section. Items can only be moved within the same section.
                Use the drag handle on the right side of each slide to move it up or down.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSlides;

