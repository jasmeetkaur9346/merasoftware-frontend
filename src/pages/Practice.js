import React, { useState } from 'react';
import { ChevronDown, X, AlertCircle, Star } from 'lucide-react';

export default function CompactTransferForm() {
  const [amount, setAmount] = useState('');
  const [bankAccounts, setBankAccounts] = useState([
    { id: 'hdfc', name: 'HDFC Bank', number: '****1234', isDefault: true },
    { id: 'sbi', name: 'SBI Bank', number: '****5678', isDefault: false },
    { id: 'icici', name: 'ICICI Bank', number: '****9012', isDefault: false }
  ]);
  const [selectedBank, setSelectedBank] = useState(
    bankAccounts.find(bank => bank.isDefault)
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setIsDropdownOpen(false);
  };

  const handleMakeDefault = () => {
    // Update bank accounts - make selected bank default and others non-default
    const updatedBankAccounts = bankAccounts.map(bank => ({
      ...bank,
      isDefault: bank.id === selectedBank.id
    }));
    
    setBankAccounts(updatedBankAccounts);
    
    // Update selected bank state
    const newDefaultBank = updatedBankAccounts.find(bank => bank.id === selectedBank.id);
    setSelectedBank(newDefaultBank);
    
    // Show success message
    alert(`${newDefaultBank.name} has been set as default account`);
  };

  const handleProceed = () => {
    if (!amount || parseFloat(amount) < 100) {
      alert('Please enter a valid amount (minimum ₹100)');
      return;
    }
    console.log('Transfer initiated:', { amount, selectedBank });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Request Transfer</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      {/* Transfer Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transfer Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₹
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">Available Balance: ₹25,450.75</p>
      </div>

      {/* Bank Account Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Bank Account
        </label>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <div className="w-6 h-4 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-3 h-1 bg-blue-500 rounded"></div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">
                  {selectedBank.name} - {selectedBank.number}
                </div>
                {selectedBank.isDefault && (
                  <span className="text-xs text-green-600 font-medium">Default</span>
                )}
              </div>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {bankAccounts.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className={`w-full flex items-center p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedBank.id === bank.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <div className="w-6 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-3 h-1 bg-blue-500 rounded"></div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">
                      {bank.name} - {bank.number}
                    </div>
                    {bank.isDefault && (
                      <span className="text-xs text-green-600 font-medium">Default</span>
                    )}
                  </div>
                  {selectedBank.id === bank.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Make Default Option - Outside of dropdown */}
      {!selectedBank.isDefault && (
        <div className="mb-6">
          <button
            onClick={handleMakeDefault}
            className="flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            <Star size={16} className="mr-2" />
            Make {selectedBank.name} Default
          </button>
        </div>
      )}

      {/* Important Information */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">Important Information</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Transfer will take 3-5 working days to process</li>
              <li>• Once processed, this action cannot be undone</li>
              <li>• Minimum transfer amount is ₹100</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button 
          onClick={handleProceed}
          className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}