import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  Wallet,
  DollarSign,
  TrendingUp,
  Package,
  Home,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    {
      title: 'Current Balance',
      value: '₹1,749.85',
      icon: Wallet,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      change: '+12.5%'
    },
    {
      title: 'Total Commission',
      value: '₹1,749.85',
      icon: DollarSign,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: '+8.2%'
    },
    {
      title: 'Total Customers',
      value: '1',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      change: '+100%'
    },
    {
      title: 'Total Orders',
      value: '4',
      icon: Package,
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      change: '+25%'
    }
  ];

  const transactions = [
    {
      id: 1,
      description: 'Mini purchased iPhone 14 Pro',
      customerName: 'Mini',
      type: 'Repeat Purchase',
      date: 'Jul 19, 2025',
      time: '04:07 PM',
      status: 'credited',
      amount: 449.95,
      isCredit: true,
      category: 'repeat'
    },
    {
      id: 2,
      description: 'Mini purchased MacBook Air',
      customerName: 'Mini',
      type: 'First Purchase',
      date: 'Jul 19, 2025',
      time: '04:00 PM',
      status: 'credited',
      amount: 519.90,
      isCredit: true,
      category: 'first'
    },
    {
      id: 3,
      description: 'Money Transfer Request',
      customerName: null,
      type: 'Transfer',
      date: 'Jul 19, 2025',
      time: '03:29 PM',
      status: 'transferred',
      amount: 390.00,
      isCredit: false,
      category: 'transfer'
    },
    {
      id: 4,
      description: 'Mini purchased AirPods Pro',
      customerName: 'Mini',
      type: 'First Purchase',
      date: 'Jul 19, 2025',
      time: '03:25 PM',
      status: 'pending',
      amount: 390.00,
      isCredit: true,
      category: 'first'
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'credited':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'transferred':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'first':
        return 'bg-emerald-100 text-emerald-700';
      case 'repeat':
        return 'bg-blue-100 text-blue-700';
      case 'transfer':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'customers', name: 'My Customers', icon: Users },
    // { id: 'settings', name: 'Settings', icon: Settings },
    // { id: 'profile', name: 'Profile', icon: User }
  ];

  const renderContent = () => {
    if (activeTab === 'customers') {
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Customers</h2>
            <p className="text-gray-600">Manage your customer relationships</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
            <p className="text-gray-500 mb-6">Start building your customer network</p>
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
              Add New Customers
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Customize your account preferences</p>
          </div>
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">Email Notifications</span>
                  <button className="bg-blue-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">SMS Alerts</span>
                  <button className="bg-gray-300 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'profile') {
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
            <p className="text-gray-600">Manage your profile information</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                AS
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Arveet Singh</h3>
                <p className="text-blue-600 font-medium">Premium Partner</p>
                <p className="text-gray-500">Member since Jul 2025</p>
              </div>
            </div>
            <div className="border-t pt-6">
              <button className="flex items-center space-x-3 text-red-600 hover:text-red-700 font-medium transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{stat.title}</h3>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20" />
              </div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                <p className="text-gray-600 text-sm">Your latest earnings and transfers</p>
              </div>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.isCredit 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.isCredit ? (
                        <ArrowUpRight className="w-6 h-6" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{transaction.description}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(transaction.category)}`}>
                          {transaction.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(transaction.status)}`}>
                          {transaction.status === 'credited' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {transaction.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{transaction.date} at {transaction.time}</p>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-xl font-bold ${
                      transaction.isCredit ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.isCredit ? '+' : '-'}₹{transaction.amount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button className="w-full text-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Fixed Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, Arveet Singh! 👋
              </h1>
              <p className="text-sm text-gray-600 mt-1">Here's what's happening with your partnership</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg">
            <ArrowUpRight className="w-4 h-4" />
            <span className="hidden sm:inline">Request Transfer</span>
            <span className="sm:hidden">Transfer</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:pt-20">
          <div className="flex flex-col flex-1 min-h-0 bg-white/50 backdrop-blur-xl border-r border-gray-200/50 m-4 rounded-2xl shadow-xl">
            <div className="flex flex-col flex-1 pt-8 pb-4">
              <nav className="flex-1 px-6 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  );
                })}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button className="w-full text-left group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex flex-col flex-1 max-w-xs w-full bg-white rounded-r-2xl shadow-2xl">
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
                <nav className="px-6 space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-4 h-6 w-6" />
                        {item.name}
                      </button>
                    );
                  })}
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <button className="w-full text-left group flex items-center px-4 py-3 text-base font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200">
                      <LogOut className="mr-4 h-6 w-6" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:pl-80 flex flex-col flex-1">
          <main className="flex-1 pt-20 lg:pt-0 pb-24 lg:pb-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 px-2 py-2 z-30 shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-t from-blue-500 to-blue-600 text-white shadow-lg transform -translate-y-1' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name === 'My Customers' ? 'Customers' : item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;