import React from 'react'
import { useNavigate } from 'react-router-dom';

// Login Popup Component
const LoginPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    
    if (!isOpen) return null;
  
    const handleLogin = () => {
      navigate('/login');
      onClose();
    };
  
    const handleContactUs = () => {
      navigate('/contact-us');
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4">Login Required</h3>
          <p className="text-gray-600 mb-6">
            Please login to proceed with the purchase. If you are a new customer, please contact us to create an account before making a payment for this order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleContactUs}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  };

export default LoginPopup
