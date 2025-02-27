import React, { useState } from 'react';
import Select from 'react-select';
import { Check, X } from 'lucide-react';

const PackageSelect = ({ 
  options, 
  value, 
  onChange, 
  components, 
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Custom Menu component with Done button
  const CustomMenu = ({ children, ...menuProps }) => {
    // Extract only the className and style props that we want to pass to the div
    const { className, style } = menuProps;
    
    return (
      <div className="relative">
        {/* Original menu - only pass safe DOM props */}
        <div className={className} style={style}>
          {children}
        </div>
        
        {/* Done and Cancel buttons */}
        <div className="sticky bottom-0 bg-white border-t p-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 text-sm rounded border flex items-center gap-1 hover:bg-gray-50"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded flex items-center gap-1 hover:bg-blue-600"
          >
            <Check size={14} />
            Done
          </button>
        </div>
      </div>
    );
  };

  return (
    <Select
      {...props}
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      menuIsOpen={isOpen}
      onMenuOpen={() => setIsOpen(true)}
      components={{
        ...components,
        Menu: CustomMenu
      }}
      className="basic-multi-select bg-slate-100 border rounded"
      classNamePrefix="select"
    />
  );
};

export default PackageSelect;