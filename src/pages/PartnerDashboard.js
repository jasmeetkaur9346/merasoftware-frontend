import React, { useState } from 'react';
import { User, DollarSign, TrendingUp, Wallet, CreditCard, Filter, Download, Eye, EyeOff, ArrowUpCircle } from 'lucide-react';
import SummaryApi from '../common';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transferAmount, setTransferAmount] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [revenueTransferAmount, setRevenueTransferAmount] = useState('');

  // Dummy data
  const walletBalance = 25450.75;
  const totalEarnings = 45670.25;
  const totalCustomers = 127;
  const activeCustomers = 89;

  const [customers, setCustomers] = React.useState([]);
  const [loadingCustomers, setLoadingCustomers] = React.useState(false);
  const [errorCustomers, setErrorCustomers] = React.useState(null);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      setErrorCustomers(null);
      try {
        const response = await fetch(SummaryApi.partnerCustomers.url, {
          method: SummaryApi.partnerCustomers.method,
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data);
        } else {
          setErrorCustomers(data.message || 'Failed to fetch customers');
        }
      } catch (error) {
        setErrorCustomers(error.message || 'Failed to fetch customers');
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);
  

  const [transactionHistory, setTransactionHistory] = useState([
    { id: 1, type: 'commission', customerName: 'Rahul Sharma', orderAmount: 2500, commissionRate: 10, commission: 250, date: '2024-07-10', orderType: 'First Purchase', status: 'Credited' },
    { id: 2, type: 'commission', customerName: 'Priya Patel', orderAmount: 1800, commissionRate: 10, commission: 180, date: '2024-07-09', orderType: 'First Purchase', status: 'Credited' },
    { id: 3, type: 'commission', customerName: 'Rahul Sharma', orderAmount: 3200, commissionRate: 5, commission: 160, date: '2024-07-08', orderType: 'Repeat Purchase', status: 'Credited' },
    { id: 4, type: 'commission', customerName: 'Amit Kumar', orderAmount: 4500, commissionRate: 10, commission: 450, date: '2024-07-07', orderType: 'First Purchase', status: 'Credited' },
    { id: 5, type: 'commission', customerName: 'Sneha Gupta', orderAmount: 3200, commissionRate: 10, commission: 320, date: '2024-07-06', orderType: 'First Purchase', status: 'Credited' },
    { id: 6, type: 'commission', customerName: 'Vikash Singh', orderAmount: 2800, commissionRate: 10, commission: 280, date: '2024-07-05', orderType: 'First Purchase', status: 'Credited' },
    { id: 7, type: 'commission', customerName: 'Priya Patel', orderAmount: 2100, commissionRate: 5, commission: 105, date: '2024-07-04', orderType: 'Repeat Purchase', status: 'Credited' },
    { id: 8, type: 'commission', customerName: 'Amit Kumar', orderAmount: 1900, commissionRate: 5, commission: 95, date: '2024-07-03', orderType: 'Repeat Purchase', status: 'Pending' },
    { id: 9, type: 'transfer', customerName: 'Transfer Request', orderAmount: 5000, commissionRate: 0, commission: -5000, date: '2024-07-02', orderType: 'Bank Transfer', status: 'Pending' },
    { id: 10, type: 'transfer', customerName: 'Transfer Request', orderAmount: 3000, commissionRate: 0, commission: -3000, date: '2024-07-01', orderType: 'Bank Transfer', status: 'Debited' }
  ]);

  // Revenue Management tab state and data
  const [revenueData, setRevenueData] = React.useState([]);
  const [loadingRevenue, setLoadingRevenue] = React.useState(false);
  const [errorRevenue, setErrorRevenue] = React.useState(null);

  React.useEffect(() => {
    if (activeTab === 'revenue') {
      const fetchRevenueData = async () => {
        setLoadingRevenue(true);
        setErrorRevenue(null);
        try {
          const response = await fetch(SummaryApi.businessCreatedToPartner.url, {
            method: SummaryApi.businessCreatedToPartner.method,
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            setRevenueData(data.data);
          } else {
            setErrorRevenue(data.message || 'Failed to fetch revenue data');
          }
        } catch (error) {
          setErrorRevenue(error.message || 'Failed to fetch revenue data');
        } finally {
          setLoadingRevenue(false);
        }
      };
      fetchRevenueData();
    }
  }, [activeTab]);

  const filteredTransactions = transactionHistory.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'first') return item.orderType === 'First Purchase';
    if (selectedFilter === 'repeat') return item.orderType === 'Repeat Purchase';
    if (selectedFilter === 'transfer') return item.type === 'transfer';
    return true;
  });

  const handleRevenueTransfer = () => {
    if (revenueTransferAmount && parseFloat(revenueTransferAmount) <= walletBalance) {
      const newTransfer = {
        id: transactionHistory.length + 1,
        type: 'transfer',
        customerName: 'Transfer Request',
        orderAmount: parseFloat(revenueTransferAmount),
        commissionRate: 0,
        commission: -parseFloat(revenueTransferAmount),
        date: new Date().toISOString().split('T')[0],
        orderType: 'Bank Transfer',
        status: 'Pending'
      };
      
      setTransactionHistory([newTransfer, ...transactionHistory]);
      alert(`Transfer request for ₹${revenueTransferAmount} has been submitted successfully. Amount will be credited to your account within 2-3 business days.`);
      setRevenueTransferAmount('');
    } else {
      alert('Invalid amount or insufficient balance');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`h-8 w-8 text-${color}-500`} />
      </div>
    </div>
  );

  const getTransactionRowClass = (item) => {
    if (item.type === 'transfer') {
      return item.status === 'Pending' ? 'bg-red-50' : 'bg-red-25';
    }
    return 'hover:bg-gray-50';
  };

  const getAmountColor = (item) => {
    if (item.type === 'transfer') {
      return 'text-red-600';
    }
    return 'text-green-600';
  };

  const getStatusColor = (status, type) => {
    if (type === 'transfer') {
      switch (status) {
        case 'Pending':
          return 'bg-red-100 text-red-800';
        case 'Debited':
          return 'bg-red-200 text-red-900';
        default:
          return 'bg-red-100 text-red-800';
      }
    }
    
    switch (status) {
      case 'Credited':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Marketing Panel</h1>
                <p className="text-sm text-gray-600">Commission Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-green-800">Active</span>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header> */}
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer List
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Revenue Management
            </button>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-900">{showBalance ? `₹${walletBalance.toLocaleString()}` : '₹****'}</p>
                    <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1">+8.2% from last month</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                    <p className="text-xs text-purple-600 mt-1">+15 new this month</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
                    <p className="text-xs text-orange-600 mt-1">70% retention rate</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
            {/* Wallet Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Wallet Overview</h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="text-sm font-medium">{showBalance ? 'Hide' : 'Show'} Balance</span>
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl p-8 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-2">Available Balance</p>
                    <p className="text-4xl font-bold">
                      {showBalance ? `₹${walletBalance.toLocaleString()}` : '₹****'}
                    </p>
                    <p className="text-sm opacity-80 mt-2">Last updated: Today</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <Wallet className="h-10 w-10" />
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Commissions */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Transaction History</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Live Updates</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer/Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Commission/Transfer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactionHistory.slice(0, 5).map((item) => (
                      <tr key={item.id} className={`${getTransactionRowClass(item)} transition-colors duration-200`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${item.type === 'transfer' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span className="text-sm font-medium text-gray-900">{item.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ₹{item.orderAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          <span className={getAmountColor(item)}>
                            {item.type === 'transfer' ? `-₹${item.orderAmount.toLocaleString()}` : `₹${item.commission}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status, item.type)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Customer List</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingCustomers ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-600">Loading customers...</td>
                      </tr>
                    ) : errorCustomers ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-red-600">{errorCustomers}</td>
                      </tr>
                    ) : customers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-600">No customers found.</td>
                      </tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.dateAdded).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalPurchases}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{customer.totalSpend.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Revenue Management</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Transactions</option>
                    <option value="first">First Purchase (10%)</option>
                    <option value="repeat">Repeat Purchase (5%)</option>
                    <option value="transfer">Transfer Requests</option>
                  </select>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

               {/* Transfer Request Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Transfer Request</h3>
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter amount to transfer"
                      value={revenueTransferAmount}
                      onChange={(e) => setRevenueTransferAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                    />
                  </div>
                  <button
                    onClick={handleRevenueTransfer}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 font-medium transition-colors duration-200"
                  >
                    <ArrowUpCircle className="h-5 w-5" />
                    <span>Request Transfer</span>
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Available Balance: <span className="font-semibold text-emerald-600">₹{walletBalance.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-gray-500">Processing time: 2-3 business days</p>
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-green-800">Total Commission Earned</p>
                                <div className="bg-green-200 p-2 rounded-full">
                                  <DollarSign className="h-4 w-4 text-green-700" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold text-green-900 mb-1">₹{filteredTransactions.filter(item => item.type === 'commission').reduce((sum, item) => sum + item.commission, 0).toLocaleString()}</p>
                              <p className="text-xs text-green-600">+5.2% from last week</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-blue-800">Total Transactions</p>
                                <div className="bg-blue-200 p-2 rounded-full">
                                  <TrendingUp className="h-4 w-4 text-blue-700" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold text-blue-900 mb-1">{filteredTransactions.length}</p>
                              <p className="text-xs text-blue-600">This month</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-6 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-red-800">Total Transfers</p>
                                <div className="bg-red-200 p-2 rounded-full">
                                  <ArrowUpCircle className="h-4 w-4 text-red-700" />
                                </div>
                              </div>
                              <p className="text-3xl font-bold text-red-900 mb-1">₹{Math.abs(filteredTransactions.filter(item => item.type === 'transfer').reduce((sum, item) => sum + item.commission, 0)).toLocaleString()}</p>
                              <p className="text-xs text-red-600">Requested amount</p>
                            </div>
                          </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingRevenue ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-gray-600">Loading revenue data...</td>
                      </tr>
                    ) : errorRevenue ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-red-600">{errorRevenue}</td>
                      </tr>
                    ) : revenueData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-gray-600">No revenue data found.</td>
                      </tr>
                    ) : (
                      revenueData.map((item) => (
                        <tr key={item.serialNo} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.paidAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.revenueAmount.split(' ')[1].replace('(', '').replace('%)', '')}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{parseFloat(item.revenueAmount.split(' ')[0]).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.paymentType === 'Full Payment' ? 'First Purchase' : 'Repeat Purchase'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Pending</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
 
export default PartnerDashboard;