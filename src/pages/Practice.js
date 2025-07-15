import React, { useState } from 'react';
import { ChevronDown, TrendingUp, BarChart3, AlertCircle, ArrowUp, Wallet, Users, CreditCard, Filter } from 'lucide-react';

const RevenueManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('All Transactions');
  
  const filterOptions = ['All Transactions', 'Pending', 'Completed', 'Failed'];
  
  const transactionData = [
    {
      customerName: 'Mini',
      orderAmount: '₹3,900',
      commissionRate: '5%',
      commissionAmount: '₹195.00',
      transactionType: 'Repeat Purchase',
      date: '7/14/2025',
      status: 'Pending'
    },
    {
      customerName: 'Rahul Kumar',
      orderAmount: '₹5,200',
      commissionRate: '6%',
      commissionAmount: '₹312.00',
      transactionType: 'New Customer',
      date: '7/13/2025',
      status: 'Completed'
    },
    {
      customerName: 'Priya Sharma',
      orderAmount: '₹2,100',
      commissionRate: '4%',
      commissionAmount: '₹84.00',
      transactionType: 'Repeat Purchase',
      date: '7/12/2025',
      status: 'Failed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="mb-4 lg:mb-8">
        <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 sm:px-4 lg:px-6">
          <button className="px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm lg:text-base text-blue-600 border-b-2 border-blue-600 font-medium whitespace-nowrap">
            Dashboard
          </button>
           <button className="px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm lg:text-base text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors">
            Customer List
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
            {/* Filter Dropdown */}
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
            
            {/* Request Transfer Button */}
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center space-x-1 sm:space-x-2 font-medium text-xs sm:text-sm lg:text-base transition-all duration-200 shadow-lg hover:shadow-xl">
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span>Request Transfer</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards - Mobile 2x2 Grid, Desktop 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {/* Current Balance */}
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

          {/* Total Commission Earned */}
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

          {/* Total Transactions */}
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

          {/* Total Transfers */}
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

      {/* Transaction Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Table Header */}
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
          {transactionData.map((transaction, index) => (
            <div key={index} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{transaction.customerName}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction.status === 'Pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : transaction.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <span className="text-gray-500 block text-xs">Order Amount</span>
                  <span className="text-gray-900 font-semibold text-sm">{transaction.orderAmount}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <span className="text-gray-500 block text-xs">Commission Rate</span>
                  <span className="text-gray-900 font-semibold text-sm">{transaction.commissionRate}</span>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <span className="text-gray-500 block text-xs">Commission</span>
                  <span className="text-green-600 font-semibold text-sm">{transaction.commissionAmount}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <span className="text-gray-500 block text-xs">Type</span>
                  <span className="text-gray-900 font-semibold text-xs">{transaction.transactionType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Customer Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Order Amount
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Commission Rate
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Commission Amount
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Transaction Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transactionData.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{transaction.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.orderAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {transaction.commissionRate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {transaction.commissionAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.transactionType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;