import React, { useState } from 'react';
import { ChevronDown, TrendingUp, BarChart3, AlertCircle, ArrowUp, Wallet, Users, CreditCard, Filter, X, Check, Plus, Minus, Eye } from 'lucide-react';

const RevenueManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('All Transactions');
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank - ****1234');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const filterOptions = ['All Transactions', 'Pending', 'Credited', 'Transferred'];
  
  const bankOptions = [
    'HDFC Bank - ****1234',
    'SBI Bank - ****5678',
    'ICICI Bank - ****9012'
  ];
  
  const transactionData = [
    {
      id: 1,
      customerName: 'Mini',
      customerInfo: 'mini@gmail.com • +91 98765 43210',
      amount: 195,
      type: 'credit',
      transactionType: 'Repeat Purchase',
      date: '7/14/2025',
      time: '2:30 PM',
      status: 'Credited',
      orderAmount: '₹3,900',
      commissionRate: '5%',
      description: 'Commission from order #ORD-2025-001'
    },
    {
      id: 2,
      customerName: 'Admin Transfer',
      customerInfo: 'system@company.com',
      amount: 2000,
      type: 'debit',
      transactionType: 'Transfer Request',
      date: '7/13/2025',
      time: '11:15 AM',
      status: 'Pending',
      orderAmount: '',
      commissionRate: '',
      description: 'Transfer to HDFC Bank - ****1234'
    },
    {
      id: 3,
      customerName: 'Rahul Kumar',
      customerInfo: 'rahul.kumar@email.com • +91 98888 77777',
      amount: 312,
      type: 'credit',
      transactionType: 'New Customer',
      date: '7/12/2025',
      time: '4:45 PM',
      status: 'Credited',
      orderAmount: '₹5,200',
      commissionRate: '6%',
      description: 'Commission from order #ORD-2025-002'
    },
    {
      id: 4,
      customerName: 'Bank Transfer',
      customerInfo: 'Previous transfer request',
      amount: 1500,
      type: 'debit',
      transactionType: 'Transfer Request',
      date: '7/11/2025',
      time: '9:20 AM',
      status: 'Transferred',
      orderAmount: '',
      commissionRate: '',
      description: 'Transfer completed to SBI Bank - ****5678'
    }
  ];

  const handleTransferRequest = () => {
    setShowTransferPopup(true);
  };

  const handleProceed = () => {
    if (transferAmount) {
      setShowTransferPopup(false);
      setShowConfirmation(true);
    }
  };

  const handleConfirmTransfer = () => {
    setShowConfirmation(false);
    setTransferAmount('');
    alert('Transfer request submitted successfully!');
  };

  const closePopups = () => {
    setShowTransferPopup(false);
    setShowConfirmation(false);
    setShowTransactionDetail(false);
    setTransferAmount('');
    setSelectedTransaction(null);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Credited': return 'bg-green-100 text-green-800';
      case 'Transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="mb-4 lg:mb-8">
        <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 sm:px-4 lg:px-6">
          <button className="px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm lg:text-base text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors">
            Dashboard
          </button>
          <button className="px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm lg:text-base text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors">
            Customer List
          </button>
          <button className="px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm lg:text-base text-blue-600 border-b-2 border-blue-600 font-medium whitespace-nowrap">
            Revenue Management
          </button>
        </div>
      </div>

      {/* Revenue Management Header Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Revenue Management</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Track and manage your earnings</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full sm:w-auto lg:w-48 appearance-none bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 pr-8 sm:pr-10 text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <button 
              onClick={handleTransferRequest}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center space-x-1 sm:space-x-2 font-medium text-xs sm:text-sm lg:text-base transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span>Request Transfer</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                +12.5% ↗
              </div>
            </div>
            <div className="mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Current Balance</p>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">₹25,450.75</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">from last month</div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white text-sm sm:text-lg font-bold">₹</span>
              </div>
              <div className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                +5.2% ↗
              </div>
            </div>
            <div className="mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Total Commission</p>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">₹1,840</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">from last week</div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xs sm:text-sm text-blue-600 bg-blue-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                This month
              </div>
            </div>
            <div className="mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Total Transactions</p>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">10</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">active orders</div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xs sm:text-sm text-orange-600 bg-orange-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                Pending
              </div>
            </div>
            <div className="mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Total Transfers</p>
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">₹8,000</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">requested amount</div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{selectedFilter}</span>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden">
          {transactionData.map((transaction) => (
            <div 
              key={transaction.id} 
              className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <Plus className="w-4 h-4 text-green-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{transaction.customerName}</div>
                      <div className="text-xs text-gray-500">{transaction.transactionType}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">{transaction.date} • {transaction.time}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className={`font-bold text-lg ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          {transactionData.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {transaction.type === 'credit' ? (
                    <Plus className="w-5 h-5 text-green-600" />
                  ) : (
                    <Minus className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{transaction.customerName}</div>
                  <div className="text-sm text-gray-500">{transaction.transactionType}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">{transaction.date}</div>
                <div className="text-xs text-gray-400">{transaction.time}</div>
              </div>
              
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
              
              <div className="flex items-center gap-3">
                <div className={`font-bold text-xl ${
                  transaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Popup */}
      {showTransactionDetail && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button 
                onClick={closePopups}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  selectedTransaction.type === 'credit' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {selectedTransaction.type === 'credit' ? (
                    <Plus className="w-8 h-8 text-green-600" />
                  ) : (
                    <Minus className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div className={`text-3xl font-bold ${
                  selectedTransaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'credit' ? '+' : '-'}₹{selectedTransaction.amount}
                </div>
                <div className="text-gray-600 mt-1">{selectedTransaction.description}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900">{selectedTransaction.customerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedTransaction.customerInfo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{selectedTransaction.transactionType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-900">{selectedTransaction.date} • {selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                
                {selectedTransaction.orderAmount && (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Order Amount:</span>
                      <span className="font-medium text-gray-900">{selectedTransaction.orderAmount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Commission Rate:</span>
                      <span className="font-medium text-gray-900">{selectedTransaction.commissionRate}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6">
                <button 
                  onClick={closePopups}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Request Popup */}
      {showTransferPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Request Transfer</h2>
              <button 
                onClick={closePopups}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Available Balance: ₹25,450.75</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank Account
                </label>
                <div className="space-y-2">
                  {bankOptions.map((bank) => (
                    <label key={bank} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="bank"
                        value={bank}
                        checked={selectedBank === bank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{bank}</span>
                        {bank === bankOptions[0] && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">Important Information</h3>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Transfer will take 3-5 working days to process</li>
                      <li>• Once processed, this action cannot be undone</li>
                      <li>• Minimum transfer amount is ₹100</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={closePopups}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleProceed}
                  disabled={!transferAmount || parseFloat(transferAmount) < 100}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* Confirmation Popup */}
    {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Transfer</h2>
              <p className="text-gray-600 mb-6">Please review your transfer details</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold text-gray-900">₹{transferAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">To Bank:</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing Time:</span>
                  <span className="text-sm font-semibold text-gray-900">3-5 Working Days</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={closePopups}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmTransfer}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueManagement;