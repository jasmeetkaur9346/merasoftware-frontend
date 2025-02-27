// Import icons
import * as Fa from 'react-icons/fa';
import * as Md from 'react-icons/md';
import * as Bi from 'react-icons/bi';
import * as Fi from 'react-icons/fi';
import * as Ai from 'react-icons/ai';

// Combine all icons
const ReactIcons = {
  ...Fa,
  ...Md,
  ...Bi,
  ...Fi,
  ...Ai
};

const renderContent = (content) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Function to process icon elements
  const processIcons = (element) => {
    // Find all spans with data-icon attribute
    const iconElements = element.querySelectorAll('span[data-icon]');
    
    iconElements.forEach(iconElement => {
      const iconName = iconElement.getAttribute('data-icon');
      const IconComponent = ReactIcons[iconName];
      
      if (IconComponent) {
        // Create container for the icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'inline-flex items-center justify-center bg-blue-50 p-2 rounded-lg shrink-0';
        
        // Create element for the icon itself
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'w-5 h-5 text-blue-600';
        
        // Get SVG content from the React Icon
        const svgContent = IconComponent({
          size: '20',
          className: 'text-blue-600'
        }).type().props.children;
        
        // Set SVG content
        iconWrapper.innerHTML = svgContent;
        iconContainer.appendChild(iconWrapper);
        
        // Replace the original span with our new container
        if (iconElement.parentElement) {
          iconElement.parentElement.replaceChild(iconContainer, iconElement);
        }
      }
    });
  };

  // Process any feature-items specifically
  const featureItems = tempDiv.querySelectorAll('.feature-item');
  featureItems.forEach(item => {
    processIcons(item);
  });

  // Also process any standalone icons
  processIcons(tempDiv);

  return tempDiv.innerHTML;
};

export default renderContent;