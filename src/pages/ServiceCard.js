import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, ShoppingBag, UserCircle, Wallet, MessageSquare, LogOut,
  Search, Bell, ChevronDown, User,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
    const currentPath = location.pathname;
  // Check if the path is active
  const isActive = (path) => {
    if (path === '/dashboard' && currentPath === '/dashboard') return true;
    if (path !== '/dashboard' && currentPath.startsWith(path)) return true;
    return false;
  };

  // Sample data
  const commissionData = [
    { id: 1, date: "2023-09-15", customer: "Rahul Sharma", amount: "₹5,200", status: "Paid" },
    { id: 2, date: "2023-09-10", customer: "Priya Singh", amount: "₹3,800", status: "Pending" },
    { id: 3, date: "2023-09-05", customer: "Amit Patel", amount: "₹7,500", status: "Paid" },
    { id: 4, date: "2023-08-28", customer: "Neha Gupta", amount: "₹4,200", status: "Paid" },
  ];

  const activeCustomers = [
    { id: 1, name: "Rahul Sharma", business: "₹52,000", joined: "Aug 2023" },
    { id: 2, name: "Priya Singh", business: "₹38,000", joined: "Jul 2023" },
    { id: 3, name: "Amit Patel", business: "₹75,000", joined: "Jun 2023" },
  ];

  const pendingReferrals = [
    { id: 1, name: "Vikram Mehta", status: "Contacted", date: "Sep 12" },
    { id: 2, name: "Sneha Verma", status: "Meeting Scheduled", date: "Sep 18" },
    { id: 3, name: "Raj Kumar", status: "Interested", date: "Sep 8" },
  ];

  const paymentHistory = [
    { id: 1, date: "2023-09-01", amount: "₹12,500", method: "Bank Transfer" },
    { id: 2, date: "2023-08-01", amount: "₹9,800", method: "Bank Transfer" },
    { id: 3, date: "2023-07-01", amount: "₹7,200", method: "Bank Transfer" },
  ];

  const navItems = [
    { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
    { id: 'commission', icon: 'fa-sack-dollar', label: 'Commission History' },
    { id: 'customers', icon: 'fa-users', label: 'Active Customers' },
    { id: 'referrals', icon: 'fa-user-plus', label: 'Pending Referrals' },
    { id: 'payments', icon: 'fa-credit-card', label: 'Payment History' },
  ];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-blue-600 font-bold text-xl">CommissionPro</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <img className="h-8 w-8 rounded-full object-cover" src="https://randomuser.me/api/portraits/men/42.jpg" alt="User profile" />
                  <span className="ml-2 hidden md:block">John Doe</span>
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      <div className="flex flex-1 dashboard-container">
        {/* Mobile sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <i className="fas fa-times text-white"></i>
                </button>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1 mt-14">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${
                      activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${item.icon} mr-3 text-lg ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`}></i>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-64 bg-white border-r shadow-sm">
           <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
          <h1 className="mr-2 text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
        </div>
        
        <div className="px-4 mt-4 mb-1 text-xs font-semibold text-gray-500 uppercase">Main Menu</div>
          <nav className="mt-4 flex-1 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center px-4 py-3 rounded-md cursor-pointer ${
                  activeTab === item.id ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${item.icon} mr-3 text-lg ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`}></i>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase">Help & Support</div>
          <ul>
                      <li>
                        <Link 
                          to="/support" 
                          className={`flex items-center px-4 py-3 ${
                            isActive('/support') 
                              ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <MessageSquare size={20} className="mr-3" />
                          <span className="font-medium">Contact Support</span>
                        </Link>
                      </li>
                    </ul>
          <div className="mt-auto border-t p-4">
                    <Link to="/logout" className="flex items-center text-red-600 hover:text-red-700">
                      <LogOut size={20} className="mr-3" />
                      <span className="font-medium">Logout</span>
                    </Link>
                  </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 main-content p-6">
          {activeTab === 'dashboard' && (
            <section>
              <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Dashboard
                  </h2>
                  <p className="mt-1 text-gray-500 text-sm">
                    Welcome back! Here's an overview of your commission earnings.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-blue-100 border border-blue-200 overflow-hidden shadow rounded-lg">
                  <div className="h-2 bg-blue-500"></div>
                  <div className="p-5 flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <i className="fas fa-wallet text-white"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">₹29,500</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <i className="fas fa-arrow-up"></i>
                            <span className="sr-only">Increased by</span> 12.5%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-100 border border-indigo-200 overflow-hidden shadow rounded-lg">
                  <div className="h-2 bg-indigo-500"></div>
                  <div className="p-5 flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <i className="fas fa-chart-line text-white"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Business Generated</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">₹2,45,000</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <i className="fas fa-arrow-up"></i>
                            <span className="sr-only">Increased by</span> 18.2%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 border border-green-200 overflow-hidden shadow rounded-lg">
                  <div className="h-2 bg-green-500"></div>
                  <div className="p-5 flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <i className="fas fa-users text-white"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">15</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <i className="fas fa-arrow-up"></i>
                            <span className="sr-only">Increased by</span> 5
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-100 border border-yellow-200 overflow-hidden shadow rounded-lg">
                  <div className="h-2 bg-yellow-500"></div>
                  <div className="p-5 flex flex-col">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <i className="fas fa-money-bill-wave text-white"></i>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Available Balance</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">₹18,700</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="bg-white shadow-sm px-5 py-3 border-t border-gray-200 mt-6 rounded-md text-sm text-right">
                      <button className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
                        Transfer to Bank <i className="fas fa-chevron-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission History Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Commission Earnings</h3>
                </div>
                <div className="px-6 py-5 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commissionData.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.customer}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Other tabs placeholders */}
          {activeTab === 'commission' && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Commission History - Coming Soon</h2>
            </section>
          )}
          {activeTab === 'customers' && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Active Customers - Coming Soon</h2>
            </section>
          )}
          {activeTab === 'referrals' && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Pending Referrals - Coming Soon</h2>
            </section>
          )}
          {activeTab === 'payments' && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Payment History - Coming Soon</h2>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;