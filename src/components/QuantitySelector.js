import React from 'react';
import { Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ 
  feature,
  baseProduct, 
  quantity, 
  onQuantityChange,
  isSelected,
  onSelect
}) => {
  const handleIncrease = () => {
    if (quantity < 50) { // Max pages from schema
      onQuantityChange(quantity + 1);
      if (!isSelected) {
        onSelect();
      }
    }
  };

  const handleDecrease = () => {
    if (quantity > baseProduct.totalPages) {
      onQuantityChange(quantity - 1);
    }
  };

  const additionalPages = Math.max(0, quantity - baseProduct.totalPages);
  const additionalPrice = additionalPages * feature.sellingPrice;

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex-grow">
        <p className="font-medium text-gray-700">{feature.serviceName}</p>
        <div className="mt-1">
          <p className="text-sm text-gray-500">Base Pages: {baseProduct.totalPages}</p>
          {/* <span className="text-gray-300">|</span> */}
          <p className="text-sm text-gray-500">₹{feature.sellingPrice} Per Additional Page</p>
        </div>
        {additionalPrice > 0 && (
          <p className="text-sm font-medium text-blue-600 mt-1">
            Additional cost: ₹{additionalPrice.toLocaleString()}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= baseProduct.totalPages}
          className={`p-1 rounded ${
            quantity <= baseProduct.totalPages 
              ? 'text-gray-300' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <span className="w-12 text-center font-medium">{quantity}</span>
        
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= 50}
          className={`p-1 rounded ${
            quantity >= 50 
              ? 'text-gray-300' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;